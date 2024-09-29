import folderModel from "../models/folder_schema.js";
import fileModel from "../models/file_schema.js";
import asyncHandler from "express-async-handler";
import multer from "multer";

const upload = multer({ dest: "/uploads/" });

const drive = [
  {
    name: "Image1",
    size: 23894,
    created: Date.now()
  },
  {
    name: "Image2",
    size: 23894,
    created: Date.now()
  },
  {
    name: "Image3",
    size: 23894,
    created: Date.now()
  },
  {
    name: "Image4",
    size: 23894,
    created: Date.now()
  },
  {
    name: "Image5",
    size: 23894,
    created: Date.now()
  }
];

const displayDrive = asyncHandler(async (req, res) => {
  res.locals.folders = await folderModel.find({ parent: null });
  const files = await fileModel.find();
  res.locals.files = [...files, ...drive];
  res.render("drive");
});

function displayCreateFolderForm(req, res) {
  res.render("folder_form");
}

const displayFolder = asyncHandler(async (req, res) => {
  res.locals.folders = await folderModel.find({ parent: req.params.id });
  res.locals.files = await fileModel.find({ folder: req.params.id });
  res.locals.dir = req.params.id;
  console.log(res.locals.folders);
  res.render("drive");
});

const handlerCreateFolderLogic = asyncHandler(async (req, res) => {
  console.log(req.body);
  await folderModel.create({
    name: req.body.folder_name,
    parent: req.body.dir || null,
    created: Date.now()
  });
  req.body.dir
    ? res.redirect(`/drive/folder/${req.body.dir}`)
    : res.redirect("/drive");
});

const handleFileUpload = [
  upload.single("file_upload"),
  asyncHandler(async (req, res) => {
    await fileModel.create({
      name: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
      created: Date.now()
    });
    res.redirect("/drive");
  })
];

export {
  displayDrive,
  displayFolder,
  displayCreateFolderForm,
  handlerCreateFolderLogic,
  handleFileUpload
};
