const express = require('express');
const router = express.Router();

//verify hospital
router.route('/verify-hospital/:id')
    .patch(require('../CONTROLLERS/adminController').verifyHospital)
//verify pharmacy
router.route('/verify-pharm/:id')
    .patch(require('../CONTROLLERS/adminController').verifypharm)
//Verified
router.route('/get-hospital')
    .get(require('../CONTROLLERS/adminController').getHospital)
router.route('/get-pharm')
    .get(require('../CONTROLLERS/adminController').getPharamacies)


    //non-verified
router.route('/get-hos-req')
    .get(require('../CONTROLLERS/adminController').getHospitalReq);
router.route('/get-pharm-req')
.get(require('../CONTROLLERS/adminController').getPharamaciesReq);


module.exports = router;