import createHttpError from "http-errors";
import { isValidObjectId } from "mongoose";

export const isValidId = (req, res, next) => {
  const { id: _id } = req.params;

  if (!isValidObjectId(_id)) {
    throw createHttpError(404, "Id is invalid");
  }
  next();
};
