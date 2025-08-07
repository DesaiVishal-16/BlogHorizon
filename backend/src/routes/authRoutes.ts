import express, { Router } from "express";
import {
  googleAuthSuccess,
  googleSignIn,
  loginUser,
  logout,
  refreshToken,
  registerUser,
} from "../controllers/authController.js";
import { validateBody } from "../middlewares/validate.js";
import { loginSchema, registerSchema } from "../validations/authValidation.js";
import passport from "passport";
import { OAuth2Client } from "google-auth-library";
import protect from "../middlewares/auth.js";

const authRoutes: Router = express.Router();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
if (!process.env.JWT_SECRET) {
  throw new Error("JWT secret is not defined");
}

authRoutes.get("/me", protect, (req, res) => {
  return res.status(200).json({ success: true, user: req.user });
});
// core auth
authRoutes.post("/register", validateBody(registerSchema), registerUser);
authRoutes.post("/login", validateBody(loginSchema), loginUser);
authRoutes.post("/logout", logout);
authRoutes.post("/refresh", refreshToken);

// Google Oauth
authRoutes.post("/google", googleSignIn);
authRoutes.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  googleAuthSuccess
);

export default authRoutes;
