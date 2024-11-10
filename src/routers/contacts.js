import { Router } from "express";
import ctrlWrapper from "../utils/ctrlWrapper.js";
import * as contactsControllers from "../controllers/contacts.js";
import validateBody from "../utils/validateBody.js";
import { contactAddSchema } from "../validation/contacts.js";
import { contactUpdateSchema } from "../validation/contacts.js";
import { isValidId } from "../middlewares/isValidId.js";
const contactsRouter = Router();

contactsRouter.get("/", ctrlWrapper(contactsControllers.getContactsController));

contactsRouter.get(
  "/:id",
  isValidId,
  ctrlWrapper(contactsControllers.getContactByIdController)
);
contactsRouter.post(
  "/",
  validateBody(contactAddSchema),
  ctrlWrapper(contactsControllers.addContactController)
);

contactsRouter.put(
  "/:id",
  isValidId,
  validateBody(contactAddSchema),
  ctrlWrapper(contactsControllers.upsertContactController)
);
contactsRouter.patch(
  "/:id",
  isValidId,
  validateBody(contactUpdateSchema),
  ctrlWrapper(contactsControllers.patchContactController)
);

contactsRouter.delete(
  "/:id",
  isValidId,
  ctrlWrapper(contactsControllers.deleteContactController)
);
export default contactsRouter;
