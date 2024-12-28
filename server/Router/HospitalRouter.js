const express = require('express');
const router = express.Router();

router.route('/login')
    .post(require('../Controller/HospitalController').HospitalLogin)
router.route('/reg-doc')
    .post(require('../Controller/AdminController').registerDoctor);
router.route('/reg-recep')
    .post(require('../Controller/AdminController').registerReception);
router.route('/get-recep')
    .get(require('../Controller/AdminController').getReceptions);
router.route('/get-doc')
    .get(require('../Controller/AdminController').getDoctors)
router.route('/req-hospital')
    .post(require('../Controller/HospitalController').hospitalRequest)// request to admin

module.exports = router;