import * as contactServices from "../services/contacts.js";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import { contactAddSchema } from "../validation/contacts.js";
import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { parseSortParams } from "../utils/parseSortParams.js";
import { sortByList } from "../db/models/Contact.js";

export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query, sortByList);
  console.log(req.user);
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
  const { error } = contactAddSchema.validate(req.body, { abortEarly: false });
  if (error) {
    throw createHttpError(400, error.message);
  }

  const data = await contactServices.addContact({ ...req.body, userId });
  res.status(201).json({
    status: 201,
    message: "Successfully created a contact!",
    data,
  });
};

export const upsertContactController = async (req, res) => {
  const { id: contactId } = req.params;
  const { _id: userId } = req.user;
  const data = await contactServices.updateContact({
    contactId,
    userId,
    payload: req.body,
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

  const result = await contactServices.updateContact({
    contactId,
    userId,
    payload: req.body,
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
