import Router from "express";
import { verifyToken } from "../middleware/jwt.js";
import { getMessage, sendMessage } from "../controllers/message/message.controller.js";

const router = Router();

router.get("/:id", verifyToken, getMessage);
router.post("/send/:id", verifyToken, sendMessage);

export default router;