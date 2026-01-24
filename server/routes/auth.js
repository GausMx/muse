// server/routes/auth.js
import express from "express";
import { body } from "express-validator";
import { validate } from "../middleware/validate.js";
import { registerUser, loginUser, forgotPassword, resetPassword } from "../controllers/auth.js";

const router = express.Router();


router.post(
    "/register",
    [
        body("email")
            .isEmail()
            .normalizeEmail()
            .withMessage("Please enter a valid email address"),
        body("password")
            .isLength({ min: 6 })
            .withMessage("Password must be at least 6 characters long") 
    ], validate, registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);


export default router;
