import { Router } from "express";
import ctrlWrapper from "../utils/ctrlWrapper.js";
import * as contactsControllers from "../controllers/contacts.js";
import validateBody from "../utils/validateBody.js";
import { contactAddSchema } from "../validation/contacts.js";
import { contactUpdateSchema } from "../validation/contacts.js";
import { isValidId } from "../middlewares/isValidId.js";
import { authenticate } from "../middlewares/authenticate.js";
import { upload } from "../middlewares/uploads.js";
const contactsRouter = Router();

contactsRouter.use(authenticate);
contactsRouter.get("/", ctrlWrapper(contactsControllers.getContactsController));

contactsRouter.get(
  "/:id",
  isValidId,
  ctrlWrapper(contactsControllers.getContactByIdController)
);
contactsRouter.post(
  "/",
  upload.single("photo"),
  validateBody(contactAddSchema),
  ctrlWrapper(contactsControllers.addContactController)
);

contactsRouter.put(
  "/:id",
  upload.single("photo"),
  isValidId,
  validateBody(contactAddSchema),
  ctrlWrapper(contactsControllers.upsertContactController)
);
contactsRouter.patch(
  "/:id",
  upload.single("photo"),
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
