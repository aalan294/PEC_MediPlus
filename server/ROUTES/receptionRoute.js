const express = require('express');
const router = express.Router();

router.route('/login')
    .post(require('../CONTROLLERS/receptionController').receptionLogin)
router.route('/new-case')
    .post(require('../CONTROLLERS/patientController').registerPatient)
router.route('/old-case/:id')
    .patch(require('../CONTROLLERS/patientController').addHistoryToPatient)
router.route('/get-all')
    .get(require('../CONTROLLERS/patientController').getAllPatients)

module.exports = router;