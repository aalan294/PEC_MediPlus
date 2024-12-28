const express = require('express');
const router = express.Router();

router.route('/login')
    .post(require('../Controller/RecepitionController').receptionLogin)
router.route('/new-case')
    .post(require('../Controller/PatientController').registerPatient)
router.route('/old-case/:id')
    .patch(require('../Controller/PatientController').addHistoryToPatient)
router.route('/get-all')
    .get(require('../Controller/PatientController').getAllPatients)

module.exports = router;