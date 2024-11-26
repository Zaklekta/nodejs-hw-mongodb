import { Schema, model } from "mongoose";
import { contactTypes } from "../../constants/contacts.js";
import { handleSaveError } from "./hooks.js";
import { setUpdateSettings } from "./hooks.js";
const contactSchema = new Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      required: true,
      enum: contactTypes,
      default: "personal",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    photo: { type: String, required: false },
  },
  { versionKey: false, timestamps: true }
);
contactSchema.post("save", handleSaveError);
contactSchema.pre("findOneAndUpdate", setUpdateSettings);
contactSchema.post("findOneAndUpdate", handleSaveError);

export const sortByList = [
  "name",
  "phoneNumber",
  "email",
  "isFavorite",
  "contactType",
];

const ContactCollection = model("contacts", contactSchema);

export default ContactCollection;
