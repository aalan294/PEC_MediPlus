const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    name: String,
    age: Number,
    gender: String,
    contactNumber: String,
    address: String,
    email: String,
    blood: String,
    emergency: String,
    DOB: String,
    history : [
        {
            prescriptionId: Number,
            date: String,
            doctor: String,
            dept: String
        }
    ],
    password: String
})

module.exports = mongoose.model('patient',patientSchema)