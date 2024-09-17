const express = require('express');
const router = express.Router();
const zod = require('zod');
const multer = require('multer');
const path = require('path');
const { Product } = require('../db');

// Define the schema for product information using zod
const productInformation = zod.object({
    productName: zod.string(),
    productPrice: zod.number(),
    discountPrice: zod.number(),
});

// Configure multer storage
const storage = multer.diskStorage({
    destination: './addProduct',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage }).single('image');

// Route to handle adding a product
router.post('/addProduct', (req, res) => {
    // First, handle file upload
    upload(req, res, async (err) => {
        if (err) return res.status(500).json({ error: err.message });

        // Construct the image URL
        const imageUrl = `http://localhost:3000/addProduct/${req.file.filename}`;

        // Validate product information
        const { success, data, error } = productInformation.safeParse({
            productName: req.body.productName,
            productPrice: req.body.productPrice,
            discountPrice: req.body.discountPrice
        });

        if (!success) return res.status(400).json({ error: error.errors });

        // Create and save the product
        try {
            const product = await Product.create({
                data: {
                    productName: data.productName,
                    productPrice: data.productPrice,
                    imageUrl,
                    discountPrice: data.discountPrice
                }
            });
            return res.status(201).json({ message: 'Product added successfully', imageUrl });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    });
});

module.exports = router;
