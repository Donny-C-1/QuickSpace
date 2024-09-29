import { Schema, ObjectId, model } from "mongoose";

const Folder = new Schema({
  name: String,
  parent: ObjectId,
  created: Date
});

export default model("folder", Folder);
