import { Router } from "express";
import {
  displayCreateFolderForm,
  displayDrive,
  handleFileUpload,
  handlerCreateFolderLogic
} from "../controller/driveController.js";

const router = Router();

router.route("/").get(displayDrive);

router
  .route("/folder/create")
  .get(displayCreateFolderForm)
  .post(handlerCreateFolderLogic);

router.route("/file/upload").post(handleFileUpload);

export default router;
