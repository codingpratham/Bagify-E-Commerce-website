import { Response } from "express";
import { AuthRequest } from "../middleware/protectedRoute";
import prisma from "../utils/prisma";

export const onboardUser = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized - User ID not found" });
    }

    const { address,  phone, city, state, country, postalCode } = req.body;

    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                address,
                phone,
                city,
                state,
                country,
                postalCode,
                isOnBoarded: true, 
            },
            })
            return res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Error during onboarding:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}