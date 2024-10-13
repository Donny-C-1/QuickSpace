import folderModel from "../models/folder_schema.js";
import fileModel from "../models/file_schema.js";
import asyncHandler from "express-async-handler";
import multer from "multer";
import { fileURLToPath } from "url";
import path from "path";
import { promises as fs } from "fs";
// import supabase from "../config/supabase.js";

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      let folder = req.query.dir;
      if (folder) {
        return cb(null, `uploads/${folder}/`);
      }
      cb(null, `uploads/`);
    },
    filename: function (req, file, cb) {
      let folder = req.query.dir;
      fileModel
        .find({
          location: folder || null,
          originalname: file.originalname
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

const displayDrive = asyncHandler(async (req, res) => {
  res.locals.folders = await folderModel.find({ parent: null });
  res.locals.files = await fileModel.find({ location: null });
  res.locals.dir = "";
  res.render("drive");
});

const displayFolder = asyncHandler(async (req, res) => {
  res.locals.folders = await folderModel.find({ parent: req.params.id });
  res.locals.files = await fileModel.find({ location: req.params.id });
  res.locals.dir = req.params.id;
  res.render("drive");
});

const downloadFile = asyncHandler(async (req, res) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.join(path.dirname(__filename), "../");

  let fileID = req.params.id;
  let file = await fileModel.findById(fileID);

  let folder = file.location ? file.location.toString() : "";

  let filePath = path.join(__dirname, "uploads", folder, file.name);
  res.download(filePath);
});

//@desc Crete a folder
//@route GET /drive/folder/create
//@access Public
const createFolder = asyncHandler(async (req, res, next) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.join(path.dirname(__filename), "../");
  let { dir, folder_name: folderName } = req.body;

  let folder = await folderModel.create({
    name: folderName,
    parent: dir || null,
    sizeInBytes: 0,
    created: Date.now(),
    type: "folder"
  });

  fs.mkdir(path.join(__dirname, "uploads", folder.id), {}, next);

  req.body.dir ? res.redirect(`/drive/folder/${dir}`) : res.redirect("/drive");
});

//@desc Upload a file
//@route GET /drive/file/upload?dir=<dirValue>
//@access Public
const uploadFile = [
  upload.single("file_upload"),
  asyncHandler(async (req, res) => {
    let folder = req.query.dir;
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
      location: folder || null
    });

    folder ? res.redirect(`/drive/folder/${folder}`) : res.redirect("/drive");
  })
];

//@desc Delete a file
//@route GET /drive/file/:id/delete
//@access Public
const deleteFile = asyncHandler(async function (req, res) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.join(path.dirname(__filename), "../");

  let fileID = req.params.id;
  let dir = req.query.dir;

  let file = await fileModel.findByIdAndDelete(fileID);

  let filePath = path.join(__dirname, "uploads", dir, file.name);
  await fs.unlink(filePath);

  res.redirect("/drive");
});

//@desc Delete a folder
//@route GET /drive/folder/:id/delete
//@access Public
const deleteFolder = asyncHandler(async function (req, res) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.join(path.dirname(__filename), "../");

  let folderID = req.params.id;
  let dir = req.query.dir;
  let folderPath = path.join(__dirname, "uploads", folderID);

  await fileModel.deleteMany({ location: folderID });
  await folderModel.findByIdAndDelete(folderID);
  await fs.rm(folderPath, { recursive: true });

  dir ? res.redirect(`/drive/folder/${dir}`) : res.redirect("/drive");
});

export {
  displayDrive,
  displayFolder,
  downloadFile,
  createFolder,
  uploadFile,
  deleteFile,
  deleteFolder
};
