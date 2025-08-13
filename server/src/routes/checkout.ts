import express from "express";
import { authMiddleware } from "../middleware/protectedRoute";
import { createOrder,  verifyPayment } from "../controller/checkout.controller";


const router = express.Router();

router.post("/create-order", authMiddleware, createOrder);
router.post('/verify-payment', authMiddleware, verifyPayment);

export default router;
