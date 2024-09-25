import { model, Schema } from "mongoose";

const fileSchema = new Schema({
  name: String,
  size: Number,
  mimetype: String,
  created: Date
});

export default model("file", fileSchema);
