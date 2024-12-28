const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3400;
const DB_URL = process.env.DB_URL;

const app = express();
app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`);
})

mongoose.connect(DB_URL).then(()=>{
    console.log("connected to the database")
})

app.use(cors());
app.use(express.json());
//routes
app.use('/hospital',require('./ROUTES/HospitalRoute'))
app.use('/doctor',require('./ROUTES/doctorRoute'))
app.use('/admin',require('./ROUTES/adminRoute'))
app.use('/pharm', require('./ROUTES/pharmacyRoute'))
app.use('/patient',require('./ROUTES/patientRoute'))
app.use('/reception',require('./ROUTES/receptionRoute'))







