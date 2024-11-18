import { Router } from "express";
import * as authControllers from "../controllers/auth.js";
import ctrlWrapper from "../utils/ctrlWrapper.js";
import validateBody from "../utils/validateBody.js";
import { registerUserSchema, loginUserSchema } from "../validation/auth.js";
const authRouter = Router();

authRouter.post(
  "/register",
  validateBody(registerUserSchema),
  ctrlWrapper(authControllers.registerController)
);

authRouter.post(
  "/login",
  validateBody(loginUserSchema),
  ctrlWrapper(authControllers.loginController)
);
authRouter.post(
  "/refresh",
  ctrlWrapper(authControllers.refreshSessionController)
);
authRouter.post("/logout", ctrlWrapper(authControllers.logoutController));
export default authRouter;
