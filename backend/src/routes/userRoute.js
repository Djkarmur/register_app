const express = require('express');
const { createUser } = require('../controllers/userController');
const { otpVerification } = require('../controllers/otpVerificationMailController');
const authenticateToken = require('../middlewares/AuthenticationToken');


const router = express.Router();

router.post('/create',createUser)

router.post('/verifyotp',authenticateToken,otpVerification)



module.exports = router;
