import { Router } from "express";
import * as authControllers from "../controllers/auth.js";
import ctrlWrapper from "../utils/ctrlWrapper.js";
import validateBody from "../utils/validateBody.js";
import {
  registerUserSchema,
  loginUserSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
  authOAuthGoogleSchema,
} from "../validation/auth.js";
import { requestResetEmailController } from "../controllers/auth.js";
import { resetPasswordController } from "../controllers/auth.js";

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

authRouter.post(
  "/send-reset-email",
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetEmailController)
);
authRouter.post(
  "/reset-pwd",
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController)
);
authRouter.get(
  "/get-oauth-url",
  ctrlWrapper(authControllers.getGoogleOAuthUrlController)
);

authRouter.post(
  "/confirm-oauth",
  validateBody(authOAuthGoogleSchema),
  ctrlWrapper(authControllers.loginWithGoogleController)
);
export default authRouter;
