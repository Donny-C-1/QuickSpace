import { model, Schema, ObjectId } from "mongoose";

const userSchema = new Schema({
  username: String,
  email: String,
  hash: Buffer,
  salt: Buffer,
  storage: ObjectId
});

export default model("User", userSchema);
