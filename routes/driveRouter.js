import { Router } from "express";
import {
  deleteFile,
  displayDrive,
  displayFolder,
  uploadFile,
  createFolder,
  deleteFolder,
  downloadFile
} from "../controller/driveController.js";

const router = Router();

router.route("/").get(displayDrive);

router.route("/folder/create").post(createFolder);

router.route("/folder/:id").get(displayFolder);

router.route("/file/upload").post(uploadFile);

router.route("/file/:id/delete").get(deleteFile);

router.route("/file/:id/download").get(downloadFile);

router.route("/folder/:id/delete").get(deleteFolder);

router.route("/file/:id/download").post();

export default router;
