import { SWAGGER_PATH } from "../constants/index.js";
import { readFileSync } from "node:fs";
import createHttpError from "http-errors";
import swaggerUI from "swagger-ui-express";
export const swaggerDocs = () => {
  try {
    const swaggerText = readFileSync(SWAGGER_PATH, "utf-8");
    const swaggerJSON = JSON.parse(swaggerText);
    return [...swaggerUI.serve, swaggerUI.setup(swaggerJSON)];
  } catch (error) {
    return (req, res, next) => {
      next(createHttpError(500, error.message));
    };
  }
};
