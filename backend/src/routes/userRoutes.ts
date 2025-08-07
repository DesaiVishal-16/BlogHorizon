import express, { Router } from "express";
import {
  deleteUser,
  getAllUsers,
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController.js";

const userRoutes: Router = express.Router();

userRoutes.get("/", getAllUsers);
userRoutes.get("/user-profile/:id", getUserProfile);
userRoutes.delete("/delete-user/:id", deleteUser);
userRoutes.put("/update-user-profile/:id", updateUserProfile);

export default userRoutes;
