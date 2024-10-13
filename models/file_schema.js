import { model, Schema, ObjectId } from "mongoose";
import { sizeString } from "../utils/byteSize.js";

const fileSchema = new Schema({
  name: String,
  originalname: String,
  sizeInBytes: Number,
  type: String,
  created: Date,
  owner: ObjectId,
  location: ObjectId
});

fileSchema.virtual("createdOn").get(function () {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric"
  };
  return Intl.DateTimeFormat("en-BR", options).format(this.created);
});

fileSchema.virtual("size").get(function () {
  if (this.sizeInBytes === 0) return "0 bytes";
  const units = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const exponent = Math.min(
    Math.floor(Math.log(this.sizeInBytes) / Math.log(1024)),
    units.length - 1
  );
  const approx = this.sizeInBytes / 1024 ** exponent;
  return `${approx.toFixed(2)} ${units[exponent]}`;
});

export default model("file", fileSchema);
