import { Schema, model } from "mongoose";
import { handleSaveError } from "./hooks.js";
import { setUpdateSettings } from "./hooks.js";
import { emailRegexp } from "../../constants/user.js";
const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, match: emailRegexp },
    password: { type: String, required: true },
  },
  { versionKey: false, timestamps: true }
);
userSchema.post("save", handleSaveError);
userSchema.pre("findOneAndUpdate", setUpdateSettings);
userSchema.post("findOneAndUpdate", handleSaveError);

const UserCollection = model("user", userSchema);

export default UserCollection;
