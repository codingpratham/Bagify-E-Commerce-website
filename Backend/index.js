const express = require('express');
const cors = require('cors');  

const app = express();
const router = require('./routes/index');

app.use(cors({
    origin: 'http://localhost:5173',  
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    credentials: true 
}));

app.use(express.json()); 

app.use('/api/v1', router);

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
