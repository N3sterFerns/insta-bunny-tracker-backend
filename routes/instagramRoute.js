import { Router } from "express";
import { addUserSession,getTotalFollowers, deleteFollower, getUserSession, editUserSession, deleteAllData } from "../controllers/instagram.controller.js";
import { verifyToken } from "../middleware/verify.js";

const router = Router()


router.post("/add-user-session", addUserSession)
router.get("/get-user-session",verifyToken, getUserSession)
router.put("/edit-user-session",verifyToken, editUserSession)
router.get("/get-followers",verifyToken, getTotalFollowers)
router.post("/delete-follower",verifyToken, deleteFollower)
router.post("/delete-all",verifyToken, deleteAllData)


export default router