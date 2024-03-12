import { Router } from "express";
import { validateUserLogin, validateUserSignup } from "../middleware/validator.js";
import { loginUser, signUpUser } from "../controllers/auth/auth.controller.js";

const router = Router();

router.post("/auth/signup", validateUserSignup, signUpUser);
router.post("/auth/login", validateUserLogin, loginUser);

export default router