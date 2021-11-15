var express = require('express');
var router = express.Router();
const fs = require('fs');
const crypto = require('crypto');
const auth = require('../config/auth');
const qr = require('qr-image');
const Tx = require('ethereumjs-tx');
const speakeasy = require('speakeasy');
const token = require('../helper/token');
const moment = require('moment');
const userServices = require("../services/userServices");
const userControllers = require('../controllers/userControllers');
const blockchainController = require('../controllers/blockchainController');
const contentCreaterControllers = require('../controllers/contentCreaterControllers')

const blockchainServices = require("../services/blockchainServices");
const { calculateHours } = require('../helper/userHelper');
const { balanceMainBNB, coinBalanceBNB } = require('../helper/bscHelper');
const { JUSTransfer } = require('../helper/fantomHelper');
const { balanceMainETH } = require('../helper/ethHelper');

//************ to get user data on header using session **********//
router.use(userControllers.sessionHeader);


//***************** post signup **************//
router.post('/signup', userControllers.upload, userControllers.submitUser);

//******************acivate account *************///
router.post('/activate-account', userControllers.activateAccount);

//******************verify account *************///
router.get("/activate/user/:id", userControllers.activateUser);

//***************** post login **************//
router.post('/login', userControllers.userLogin);

//***************** post forgot pass **************//
//router.post('/submit-otp', userControllers.submitOtp);

//***************** post forgot pass **************//
router.post('/forgot-password', userControllers.forgetPassword);

//***************** post forgot pass **************//
router.post('/change-password', token, userControllers.submitChange);

//***************** get create wallet **************//
router.post('/create-wallet', token, blockchainController.createWallet);

//*******************update profile ***************//
router.post('/update-profile', token, userControllers.updateProfile);

//*************************for content creater **************//
router.post('/contentCreater-login', contentCreaterControllers.login);

router.post('/contentCreater-signup', contentCreaterControllers.upload, contentCreaterControllers.submitContentCreater);

router.post('/activate-contentCreater-account', contentCreaterControllers.activateAccount);

router.get("/activate/contentCreater/:id", contentCreaterControllers.activateContentCreater);

router.post('/contentCreater-forgot-password', contentCreaterControllers.forgetPassword);

router.post('/contentCreater-change-password', token, contentCreaterControllers.submitChange);

router.post('/contentCreater-update-profile', token, contentCreaterControllers.updateContentCreaterProfile);

router.post('/contentCreater-submitkyc', token, contentCreaterControllers.kycPost)

module.exports = router;
