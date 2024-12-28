const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3400;
const DB_URL = process.env.MONGODB_URL;

const app = express();


mongoose.connect(DB_URL)
   .then(()=>{
    console.log("connected to the database")
})
   .catch((err)=>{
    console.log('Error Connection To database.',err.message);
   })

app.use(cors());
app.use(express.json());

//routes
app.use('/hospital',require('./Router/HospitalRouter'));
app.use('/doctor',require('./Router/DoctorRouter'));
app.use('/admin',require('./Router/AdminRouter'));
app.use('/pharm',require('./Router/PharamacyRouter'));
app.use('/patient',require('./Router/PatientRouter'));
app.use('/reception',require('./Router/RecepitionRouter'))







app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`);
})