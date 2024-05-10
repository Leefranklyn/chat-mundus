import { Router } from "express";
import { validateUserLogin, validateUserSignup } from "../middleware/validator.js";
import { loginUser, signUpUser } from "../controllers/auth/auth.controller.js";
import { getloggedInUserInfo, searchForUsers, sendFriendRequest, viewReceivedFriendRequests, viewSentFriendRequests } from "../controllers/user/user.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = Router();

router.post("/auth/signup", validateUserSignup, signUpUser);
router.post("/auth/login", validateUserLogin, loginUser);
router.get("/", verifyToken, getloggedInUserInfo);
router.get("/search", verifyToken, searchForUsers);
router.post("/sendrequest/:id", verifyToken, sendFriendRequest);
router.get("/sentrequests", verifyToken, viewSentFriendRequests);
router.get("/receivedrequests", verifyToken, viewReceivedFriendRequests);




export default router