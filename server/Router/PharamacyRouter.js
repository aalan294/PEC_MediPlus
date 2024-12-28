const express = require('express');
const router = express.Router();


router.route('/login')
    .post(require('../Controller/PharmacyController').pharmLogin);
router.route('/reg-pharm')
    .post(require('../Controller/AdminController').registerPharmacy); //request to admin

module.exports = router;