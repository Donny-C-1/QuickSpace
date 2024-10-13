import { Schema, ObjectId, model } from "mongoose";

const folderSchema = new Schema({
  name: {
    type: String,
    required: [true, "Folder name is required to create folder"]
  },
  created: Date,
  sizeInBytes: Number,
  type: String,
  owner: ObjectId,
  parent: ObjectId
});

folderSchema.virtual("createdOn").get(function () {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric"
  };
  return Intl.DateTimeFormat("en-BR", options).format(this.created);
});

folderSchema.virtual("size").get(function () {
  if (this.sizeInBytes === 0) return "0 bytes";
  const units = ["bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const exponent = Math.min(
    Math.floor(Math.log(this.sizeInBytes) / Math.log(1024)),
    units.length - 1
  );
  const approx = this.sizeInBytes / 1024 ** exponent;
  return `${approx.toFixed(2)} ${units[exponent]}`;
});

export default model("folder", folderSchema);
