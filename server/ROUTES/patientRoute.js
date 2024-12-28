const express = require('express');
const router = express.Router();

router.route('/login')
    .post(require('../CONTROLLERS/patientController').patientLogin)

module.exports = router