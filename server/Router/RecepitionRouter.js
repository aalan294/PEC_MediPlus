const express = require('express');
const router = express.Router();

router.route('/login')//check
    .post(require('../Controller/RecepitionController').receptionLogin)
router.route('/new-case')//check
    .post(require('../Controller/PatientController').registerPatient)
router.route('/old-case/:id')//check
    .patch(require('../Controller/PatientController').addHistoryToPatient)
router.route('/get-all')
    .get(require('../Controller/PatientController').getAllPatients)

module.exports = router;