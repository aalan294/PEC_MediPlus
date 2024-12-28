const express = require('express');
const router = express.Router();

//verify hospital
router.route('/verify-hospital/:id')//check
    .patch(require('../Controller/AdminController').verifyHospital)
//verify pharmacy
router.route('/verify-pharm/:id')//check
    .patch(require('../Controller/AdminController').verifypharm)
//Verified
router.route('/get-hospital')//check
    .get(require('../Controller/AdminController').getHospital)
router.route('/get-pharm')//check
    .get(require('../Controller/AdminController').getPharamacies)


    //non-verified
router.route('/get-hos-req')//check
    .get(require('../Controller/AdminController').getHospitalReq);
router.route('/get-pharm-req')//check
.get(require('../Controller/AdminController').getPharamaciesReq);


module.exports = router;