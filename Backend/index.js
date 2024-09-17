const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

const storage = multer.diskStorage({
    destination: './addProduct',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage }).single('image');

// Import your routes
const router = require('./routes/index');
app.use('/api/v1', router);

// Start the server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
