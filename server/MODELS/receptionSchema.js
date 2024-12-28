const mongoose = require('mongoose');

const receptionSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    wallet: String,
    password: String,
    hospital: String,
    verification: String
})

module.exports = mongoose.model('receptionist',receptionSchema)