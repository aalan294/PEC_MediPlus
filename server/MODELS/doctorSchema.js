const mongoose = require('mongoose')

const doctorSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    phone: String,
    address: String,
    wallet: String,
    hospital: String,
    verification: String,
    dept: String
})

module.exports = mongoose.model('doctor',doctorSchema)