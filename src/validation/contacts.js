import Joi from "joi";
import { contactTypes } from "../constants/contacts.js";
export const contactAddSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  phoneNumber: Joi.string().min(3).max(20).required(),
  email: Joi.string().min(3).max(20).optional(),
  isFavourite: Joi.boolean().default(false),
  contactType: Joi.string()
    .valid(...contactTypes)
    .default("personal"),
});

export const contactUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string().min(3).max(20),
  email: Joi.string().min(3).max(20),
  isFavourite: Joi.boolean().default(false),
  contactType: Joi.string()
    .valid(...contactTypes)
    .default("personal"),
});
