import { Router } from "express";
import {
  displayDrive,
  displayFolder,
  handleFileUpload,
  handlerCreateFolderLogic
} from "../controller/driveController.js";

const router = Router();

router.route("/").get(displayDrive);

router.route("/folder/create").post(handlerCreateFolderLogic);

router.route("/folder/:id").get(displayFolder);

router.route("/file/upload").post(handleFileUpload);

export default router;
