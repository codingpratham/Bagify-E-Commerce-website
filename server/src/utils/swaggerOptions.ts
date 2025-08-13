// src/utils/swagger.ts
import swaggerJSDoc from "swagger-jsdoc";
import { Options } from "swagger-jsdoc";

const swaggerOptions: Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "My API Docs",
            version: "1.0.0",
        },
        servers: [{ url: "http://localhost:5000/api" }],
    },
    apis: ["./src/routes/*.ts"], // 👈 Add all route files here
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
