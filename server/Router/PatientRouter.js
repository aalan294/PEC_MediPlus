const express = require('express');
const router = express.Router();

router.route('/login')
    .post(require('../Controller/PatientController').patientLogin)

module.exports = router