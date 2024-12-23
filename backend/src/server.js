const express = require('express')
const connectDB = require('./config/db')
const userRoutes = require('./routes/userRoute')
require('dotenv').config();
const cors = require('cors');

connectDB();

const app = express();
app.use(express.json());
app.use(cors());

//routes
app.use('/api/users',userRoutes)

app.get('/',(req,res) => {
    res.send('API is Running..')
})

const PORT = process.env.PORT || 5000;
app.listen(PORT,() => {
    console.log(`Server running on http://localhost:${PORT}`);
})