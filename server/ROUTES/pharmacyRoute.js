const express = require('express');
const router = express.Router();


router.route('/login')
    .post(require('../CONTROLLERS/pharmacyController').pharmLogin);
router.route('/reg-pharm')
    .post(require('../CONTROLLERS/adminController').registerPharmacy); //request to admin

module.exports = router;