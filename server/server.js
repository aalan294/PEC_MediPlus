const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3400;
const DB_URL = process.env.MONGODB_URL;

const app = express();


mongoose.connect(DB_URL).then(()=>{
    console.log("connected to the database")
})

app.use(cors());
app.use(express.json());

//routes
app.use('/hospital')
app.use('/doctor')
app.use('/admin')
app.use('/pharm')
app.use('/patient')
app.use('/reception')







app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`);
})