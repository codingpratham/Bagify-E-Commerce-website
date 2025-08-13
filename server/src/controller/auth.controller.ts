import { Request, Response } from "express";
import prisma from "../utils/prisma";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

export const Register = async (req: Request, res: Response) => {
    const {
        name,
        email,
        password,
        role
    } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
            }
        })

        if (process.env.JWT_SECRET === undefined) {
            return res.status(500).json({ message: "JWT secret is not defined" });
        }

        const token = jwt.sign({
            userId: user.id,
            role: user.role
        }, process.env.JWT_SECRET)

        if (!token) {
            return res.status(500).json({ message: "Failed to generate token" });
        }

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000
        })

        return res.status(201).json({ message: "User registered successfully", user, token });

    } catch (error) {
        console.error("Error during registration:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const Login = async (req: Request, res: Response) => {
    const {
        email,
        password
    } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const existingUser = await prisma.user.findUnique({
        where: {
            email
        }
        })

        if (!existingUser) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        if (process.env.JWT_SECRET === undefined) {
            return res.status(500).json({ message: "JWT secret is not defined" });
        }
        const token = jwt.sign({
            userId: existingUser.id,
            role: existingUser.role
        }, process.env.JWT_SECRET);
        if (!token) {
            return res.status(500).json({ message: "Failed to generate token" });
        }
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000
        });
        return res.status(200).json({ message: "Login successful", user: existingUser, token });
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const Logout = async (req: Request, res: Response) => {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logout successful" });
}
