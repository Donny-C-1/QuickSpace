import folderModel from "../models/folder_schema.js";
import fileModel from "../models/file_schema.js";
import asyncHandler from "express-async-handler";
import multer from "multer";
import { fileURLToPath } from "url";
import path from "path";
import { promises as fs } from "fs";
import { getFolderDirectory } from "../utils/folder.js";
// import supabase from "../config/supabase.js";

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, _file, cb) {
      let driveID = req.user.storage;
      let folderID = req.query.dir;
      if (folderID === driveID) {
        return cb(null, `uploads/${driveID}/`);
      }
      cb(null, `uploads/${driveID}/${folderID}`);
    },
    filename: function (req, file, cb) {
      let folderID = req.query.dir;
      let userID = req.user.id;
      fileModel
        .find({
          location: folderID,
          originalname: file.originalname,
          owner: userID
        })
        .then((files) => {
          if (files.length > 0) {
            let basename = path.basename(file.originalname);
            let ext = path.extname(file.originalname);
            return cb(null, `${basename} (${files.length})${ext}`);
          }
          cb(null, file.originalname);
        })
        .catch((err) => cb(err));
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

/* --------------------
 * CREATE CONTROLLERS
 ---------------------*/

//@desc Crete a folder
//@route GET /drive/folder/create
//@access Private
const createFolder = asyncHandler(async (req, res, next) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.join(path.dirname(__filename), "../");
  let { dir, folder_name: folderName } = req.body;
  let inFolder = dir !== req.user.storage;

  let folder = await folderModel.create({
    name: folderName,
    location: dir,
    sizeInBytes: 0,
    created: Date.now(),
    type: "folder",
    owner: req.user.id
  });

  await fs.mkdir(path.join(__dirname, "uploads", req.user.storage, folder.id));

  inFolder ? res.redirect(`/drive/folder/${dir}`) : res.redirect("/drive");
});

//@desc Upload a file
//@route GET /drive/file/upload?dir=<dirValue>
//@access Public
const uploadFile = [
  upload.single("file_upload"),
  asyncHandler(async (req, res) => {
    let driveID = req.user.storage;
    let folderID = req.query.dir;
    let inFolder = Boolean(driveID !== folderID);
    // const { originalname, buffer } = req.file;

    // const { data, error } = await supabase.storage
    //   .from("Drive")
    // .listBuckets();
    // .upload(`${originalname}`, buffer);

    // if (error) return res.status(500).json({ error: error.message });
    // console.log(data);

    await fileModel.create({
      name: req.file.filename,
      originalname: req.file.originalname,
      sizeInBytes: req.file.size,
      type: req.file.mimetype,
      created: Date.now(),
      owner: req.user.id,
      location: folderID
    });

    inFolder
      ? res.redirect(`/drive/folder/${folderID}`)
      : res.redirect("/drive");
  })
];

/* ----------------
 * READ CONTROLLER
 -----------------*/

//@desc Display the drive
//@route GET /drive
//@access Private
const displayDrive = asyncHandler(async (req, res) => {
  let { id: userID, storage } = req.user;
  res.locals.folders = await folderModel.find({
    location: storage,
    owner: userID
  });
  res.locals.files = await fileModel.find({
    location: storage,
    owner: userID
  });
  res.locals.dir = req.user.storage;
  res.render("drive");
});

//@desc Display a folder
//@route GET /drive/folder/:id
//@access Private
const displayFolder = asyncHandler(async (req, res) => {
  let { id: dirID } = req.params;

  // const directories = await getFolderDirectory(dirID, req.user.storage);

  res.locals.folders = await folderModel.find({
    location: dirID,
    owner: req.user.id
  });
  res.locals.files = await fileModel.find({
    location: dirID,
    owner: req.user.id
  });
  res.locals.directories = await getFolderDirectory(dirID, req.user.storage);
  res.locals.dir = dirID;
  res.render("drive");
});

// function

//@desc Download a file
//@route GET /drive/file/:id/download
//@access Private
const downloadFile = asyncHandler(async (req, res) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.join(path.dirname(__filename), "../");

  let fileID = req.params.id;
  let file = await fileModel.findOne({ _id: fileID, owner: req.user.id });

  let folder =
    file.location.toString() == req.user.storage
      ? ""
      : file.location.toString();

  let filePath = path.join(
    __dirname,
    "uploads",
    req.user.storage,
    folder,
    file.name
  );
  res.download(filePath);
});

/* -----------------
* DELETE CONTROLLERS
--------------------*/

//@desc Delete a file
//@route GET /drive/file/:id/delete
//@access Private
const deleteFile = asyncHandler(async function (req, res) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.join(path.dirname(__filename), "../");

  let fileID = req.params.id;

  let file = await fileModel.findByIdAndDelete(fileID);
  let dir = file.location.toString() === req.user.storage ? "" : file.location;

  let filePath = path.join(
    __dirname,
    "uploads",
    req.user.storage,
    dir.toString(),
    file.name
  );
  await fs.unlink(filePath);

  res.redirect("/drive");
});

//@desc Delete a folder
//@route GET /drive/folder/:id/delete?dir=<dir>
//@access Private
const deleteFolder = asyncHandler(async function (req, res) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.join(path.dirname(__filename), "../");

  let folderID = req.params.id;
  let dir = req.query.dir;

  console.log(typeof req.user.storage, req.user.storage);

  let allFoldersID = await findSubfolderIds(folderID);

  allFoldersID = allFoldersID.concat(folderID);

  await folderModel.deleteMany({ _id: allFoldersID });
  await fileModel.deleteMany({ location: allFoldersID });

  for (let id of allFoldersID) {
    await fs.rm(path.join(__dirname, "uploads", req.user.storage, id), {
      recursive: true
    });
  }

  // await fs.rm(folderPath, { recursive: true });

  dir === req.user.storage
    ? res.redirect("/drive")
    : res.redirect(`/drive/folder/${dir}`);
});

async function findSubfolderIds(folderId) {
  const subfolders = await folderModel.find({ location: folderId });
  let ids = subfolders.map((folder) => folder.id);

  for (const subfolder of subfolders) {
    const childIds = await findSubfolderIds(subfolder.id);
    ids = ids.concat(childIds);
  }

  return ids;
}

export {
  displayDrive,
  displayFolder,
  downloadFile,
  createFolder,
  uploadFile,
  deleteFile,
  deleteFolder
};
