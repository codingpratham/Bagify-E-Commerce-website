const express = require('express');
const router = express.Router();
const zod = require('zod');
const multer = require('multer');
const path = require('path');
const { Product } = require('../db');

const productInformation = zod.object({
    productName: zod.string(),
    productPrice: zod.number(),
    discountPrice: zod.number().optional(),
});

const storage = multer.diskStorage({
    destination: './uploads',  // Make sure this directory exists
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage }).single('image');


router.post('/addProduct', (req, res) => {

    upload(req, res, async (err) => {
        if (err) return res.status(500).json({ error: err.message });

        // Construct the image URL
        const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;

        // Validate product information
        try {
            // Since multer is handling multipart data, we use req.body directly
            const { success, data, error } = productInformation.safeParse({
                productName: req.body.productName,
                productPrice: parseFloat(req.body.productPrice),
                discountPrice: parseFloat(req.body.discountPrice) || 0
            });

            if (!success) return res.status(400).json({ error: error.errors });

            // Create and save the product
            const product = await Product.create({
                productName: data.productName,
                productPrice: data.productPrice,
                imageUrl,
                discountPrice: data.discountPrice
            });

            return res.status(201).json({ message: 'Product added successfully', imageUrl });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    });
});

router.get('/product', async (req, res) => {
    try {
        const products = await Product.find({}); // Fetch all products

        return res.status(200).json(
            products.map((product) => {
                return {
                    id: product._id, // Changed to product._id, assuming MongoDB ObjectId
                    productName: product.productName,
                    productPrice: product.productPrice,
                    imageUrl: product.imageUrl,
                    discountPrice: product.discountPrice
                };
            })
        );
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

module.exports = router;
