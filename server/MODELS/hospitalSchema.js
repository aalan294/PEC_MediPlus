const mongoose = require('mongoose')

const hospitalSchema = new mongoose.Schema({
    owner: String,
    email: String,
    address: String,
    wallet: String,
    name: String,
    phone: String,
    verification: String,
    password: String,
    isVerified: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('hospital',hospitalSchema)