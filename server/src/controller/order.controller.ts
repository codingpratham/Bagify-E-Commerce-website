import { AuthRequest } from "../middleware/protectedRoute";
import { Response } from "express";
import prisma from "../utils/prisma";

export const getOrders = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        product: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({ data: orders });
  } catch (err) {
    console.error("Get orders error:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};
