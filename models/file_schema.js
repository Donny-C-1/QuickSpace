import { model, Schema, ObjectId } from "mongoose";

const fileSchema = new Schema({
  name: String,
  size: Number,
  mimetype: String,
  created: Date,
  location: ObjectId
});

export default model("file", fileSchema);
