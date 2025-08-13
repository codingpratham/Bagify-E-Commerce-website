import { Response } from "express";
import { AuthRequest } from "../middleware/protectedRoute";
import prisma from "../utils/prisma";

export const getCart = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const cart = await prisma.cart.findMany({
      where: {
        userId,
      },
      include: {
        product: true,
      },
    });

    return res.status(200).json({
      message: "Cart fetched successfully",
      data: cart, 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const addToCart = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  console.log("Request Body:", req.body);

  const { productId, quantity } = req.body;

  if (!productId || typeof quantity !== "number" || quantity <= 0) {
    return res
      .status(400)
      .json({ message: "Product ID and a valid quantity are required" });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: "Insufficient stock for this product" });
    }

    const existingCartItem = await prisma.cart.findFirst({
      where: { userId, productId },
    });

    if (existingCartItem) {
      const updatedCart = await prisma.cart.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: existingCartItem.quantity + quantity,
        },
      });

      return res.status(200).json({
        message: "Product quantity updated in cart",
        cart: updatedCart,
      });
    }

    const newCart = await prisma.cart.create({
      data: {
        userId,
        productId,
        quantity,
      },
    });

    return res.status(201).json({
      message: "Product added to cart successfully",
      cart: newCart,
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const removeFromCart = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { cartItemId } = req.params;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!cartItemId) {
    return res.status(400).json({ message: "Cart item ID is required" });
  }

  try {
    const existingCart = await prisma.cart.findFirst({
      where: {
        id: cartItemId,
        userId,
      },
    });

    if (!existingCart) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    await prisma.cart.delete({
      where: { id: cartItemId },
    });

    return res.status(200).json({ message: "Cart item removed successfully" });
  } catch (error) {
    console.error("Remove from cart error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// cart.controller.ts
export const clearCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await prisma.cart.deleteMany({
      where: { userId },
    });

    res.status(200).json({ message: "Cart cleared" });
  } catch (err) {
    console.error("Error clearing cart:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


