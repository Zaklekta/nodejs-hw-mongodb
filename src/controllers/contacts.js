import * as contactServices from "../services/contacts.js";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import { contactAddSchema } from "../validation/contacts.js";
import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { parseSortParams } from "../utils/parseSortParams.js";
import { sortByList } from "../db/models/Contact.js";
import { saveFileToUploadDir } from "../utils/saveFileToUploadDir.js";
import path from "node:path";
import { saveFileToCloudinary } from "../utils/saveFileToCloudinary.js";
import { env } from "../utils/env.js";

const enableCloudinary = env("ENABLE_CLOUDINARY");

export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query, sortByList);
  const { _id: userId } = req.user;
  const filter = { userId: userId };
  const data = await contactServices.getContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });
  res.json({
    status: 200,
    message: "Successfully found contacts!",
    data,
  });
};

export const getContactByIdController = async (req, res) => {
  const { id: contactId } = req.params;
  const { _id: userId } = req.user;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return res.status(404).json({ status: 404, message: "Contact not found" });
  }

  const data = await contactServices.getContactById(contactId, userId);
  if (!data) {
    throw createHttpError(404, "Contact not found");
  }
  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data,
  });
};

export const addContactController = async (req, res) => {
  const { _id: userId } = req.user;
  let photo = null;
  if (req.file) {
    if (enableCloudinary === "true") {
      photo = await saveFileToCloudinary(req.file, "photos");
    } else {
      await saveFileToUploadDir(req.file);
      photo = path.join(req.file.filename);
    }
  }
  const { error } = contactAddSchema.validate(req.body, { abortEarly: false });
  if (error) {
    throw createHttpError(400, error.message);
  }

  const data = await contactServices.addContact({ ...req.body, photo, userId });
  res.status(201).json({
    status: 201,
    message: "Successfully created a contact!",
    data,
  });
};

export const upsertContactController = async (req, res) => {
  const { id: contactId } = req.params;
  const { _id: userId } = req.user;
  const photo = req.file;
  console.log(photo);
  let photoUrl;
  if (photo) {
    if (enableCloudinary === "true") {
      photoUrl = await saveFileToCloudinary(req.file, "photos");
    } else {
      await saveFileToUploadDir(req.file);
      photoUrl = path.join(req.file.filename);
    }
  }
  const data = await contactServices.updateContact({
    contactId,
    userId,
    payload: { ...req.body, photo: photoUrl },
    options: { upsert: true },
  });
  if (!data) {
    throw createHttpError(404, "Contact not found or could not be updated");
  }
  res.json({
    status: 200,
    message: "Successfully apdated the contact",
    data: data.data,
  });
};
export const patchContactController = async (req, res) => {
  const { id: contactId } = req.params;
  const { _id: userId } = req.user;
  const photo = req.file;
  let photoUrl;

  if (photo) {
    if (enableCloudinary === "true") {
      photoUrl = await saveFileToCloudinary(req.file, "photos");
    } else {
      await saveFileToUploadDir(req.file);
      photoUrl = path.join(req.file.filename);
    }
  }

  const result = await contactServices.updateContact({
    contactId,
    userId,
    payload: { ...req.body, photo: photoUrl },
  });
  if (!result) {
    throw createHttpError(404, "Contact not found");
  }

  res.json({
    status: 200,
    message: "Successfully patched the contact!",
    data: result.data,
  });
};

export const deleteContactController = async (req, res) => {
  const { id: contactId } = req.params;
  const { _id: userId } = req.user;
  const data = await contactServices.deleteContact(contactId, userId);
  if (!data) {
    throw createHttpError(404, "Contact not found");
  }
  res.status(204).send();
};
