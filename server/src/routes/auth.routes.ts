import express, { Response } from "express";
import { onboardUser } from "../controller/onboarding.controller";
import { authMiddleware, AuthRequest } from "../middleware/protectedRoute";
import {Login, Register} from "../controller/auth.controller";

const router = express.Router();


router.post("/register", Register);
router.post("/login", Login);
router.put("/onboard",authMiddleware, onboardUser);
router.post('/logout', (req, res) => {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logout successful" });
});
router.get('/user', authMiddleware, (req:AuthRequest, res:Response) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });

    }
})

export default router;
