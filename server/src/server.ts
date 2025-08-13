// src/app.ts
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./routes";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import {swaggerSpec} from "./utils/swaggerOptions";


dotenv.config();
const app = express();


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: [
    process.env.CLIENT_URL as string,
    process.env.CLIENT_URL2 as string,
  ],
  credentials: true,
}));

// ✅ Mount Swagger UI separately
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ✅ Mount API routes under `/api`
app.use('/api', router);

export default app;
