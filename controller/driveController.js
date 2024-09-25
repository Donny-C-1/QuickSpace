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
  const folders = await folderModel.find({ parent: "root" });
  const files = await fileModel.find();
  res.locals.files = [...folders, ...drive, ...files];
  res.render("drive");
});

function displayCreateFolderForm(req, res) {
  res.render("folder_form");
}

const handlerCreateFolderLogic = asyncHandler(async (req, res) => {
  console.log(req.body);
  const folder = await folderModel.create({
    name: req.body.folder_name,
    parent: "root",
    created: Date.now()
  });
  res.redirect("/drive");
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
  displayCreateFolderForm,
  handlerCreateFolderLogic,
  handleFileUpload
};
