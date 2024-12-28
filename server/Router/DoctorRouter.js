const express = require('express');
const router = express.Router();

router.route('/login')//Check
    .post(require('../Controller/DoctorController').loginDoctor);
router.route('/all-patients')
    .get(require('../Controller/PatientController').getAllPatients);
router.route('/get/:id')
    .get(require('../Controller/PatientController').getPatient)

module.exports = router