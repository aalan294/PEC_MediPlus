const express = require('express');
const router = express.Router();

router.route('/login')
    .post(require('../CONTROLLERS/hospitalController').HospitalLogin)
router.route('/reg-doc')
    .post(require('../CONTROLLERS/adminController').registerDoctor);
router.route('/reg-recep')
    .post(require('../CONTROLLERS/adminController').registerReception);
router.route('/get-recep')
    .get(require('../CONTROLLERS/adminController').getReceptions);
router.route('/get-doc')
    .get(require('../CONTROLLERS/adminController').getDoctors)
router.route('/req-hospital')
    .post(require('../CONTROLLERS/hospitalController').hospitalRequest)// request to admin

module.exports = router;