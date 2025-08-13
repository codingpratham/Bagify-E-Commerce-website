import crypto from "crypto";
import { Response } from "express";
import { AuthRequest } from "../middleware/protectedRoute";
import prisma from "../utils/prisma";
import { razorPay } from "../utils/razorpay";

export const createOrder = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const { amount, cartId, productId } = req.body;

  if (!amount || !cartId || !productId) {
    return res.status(400).json({ success: false, message: "Required fields missing" });
  }

  try {
    const options = {
      amount: amount * 100, // in paise
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const razorpayOrder = await razorPay.orders.create(options);

    // Save order in DB
    const newOrder = await prisma.order.create({
      data: {
        userId,
        productId,
        totalAmount: amount,
        razorpayOrderId: razorpayOrder.id,
        currency: razorpayOrder.currency,
        receipt: razorpayOrder.receipt as any,
        status: "PENDING",
      },
    });

    return res.status(200).json({
      success: true,
      order: razorpayOrder,
      orderId: newOrder.id,
    });
  } catch (error) {
    console.error("Order creation failed:", error);
    return res.status(500).json({ success: false, message: "Failed to create order" });
  }
};

export const verifyPayment = async (req: AuthRequest, res: Response) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isAuthentic = generatedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    const existingOrder = await prisma.order.findFirst({
      where: { razorpayOrderId: razorpay_order_id },
    });

    if (!existingOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (existingOrder.status === "COMPLETED") {
      return res.status(200).json({ success: true, message: "Payment already verified" });
    }

    await prisma.order.update({
      where: { id: existingOrder.id },
      data: {
        status: "COMPLETED",
        razorpayPaymentId: razorpay_payment_id,
        
      },
    });

    return res.status(200).json({ success: true, message: "Payment verified successfully" });
  } catch (err) {
    console.error("Payment verification error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
