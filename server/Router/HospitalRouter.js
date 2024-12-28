const express = require('express');
const router = express.Router();

router.route('/login')//check
    .post(require('../Controller/HospitalController').HospitalLogin)
router.route('/reg-doc')//check
    .post(require('../Controller/AdminController').registerDoctor);
router.route('/reg-recep')//check
    .post(require('../Controller/AdminController').registerReception);
router.route('/get-recep')//check
    .get(require('../Controller/AdminController').getReceptions);
router.route('/get-doc')//check
    .get(require('../Controller/AdminController').getDoctors)
router.route('/req-hospital')//chek 
    .post(require('../Controller/HospitalController').hospitalRequest)// request to admin

module.exports = router;