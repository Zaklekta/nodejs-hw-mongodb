import { OAuth2Client } from "google-auth-library";
import * as path from "node:path";
import { readFile } from "node:fs/promises";
import { env } from "./env.js";
import createHttpError from "http-errors";

const googleOAuthSettingsPath = path.resolve("google-oauth.json");
const oauthConfig = JSON.parse(
  await readFile(googleOAuthSettingsPath, "utf-8")
);
const clientId = env("GOOGLE_AUTH_CLIENT_ID");
const clientSecret = env("GOOGLE_AUTH_CLIENT_SECRET");
const googleOAuthClient = new OAuth2Client({
  clientId,
  clientSecret,
  redirectUri: oauthConfig.web.redirect_uris[0],
});
export const generateAuthUrl = () =>
  googleOAuthClient.generateAuthUrl({
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ],
  });
export const validateCode = async (code) => {
  const response = await googleOAuthClient.getToken(code);
  console.log(response);
  if (!response.tokens.id_token) {
    throw createHttpError(401);
  }
  const ticket = await googleOAuthClient.verifyIdToken({
    idToken: response.tokens.id_token,
  });
  return ticket;
};

export const getUsernameFromGoogleTokenPayload = (payload) => {
  if (payload.name) return payload.name;
  let username = "";
  if (payload.given_name) {
    username += payload.given_name;
  }
  if (payload.family_name) {
    username += payload.family_name;
  }
  return username;
};
