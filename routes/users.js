var express = require('express');
const flash = require('express-flash');
var session = require('express-session');
const authenticate = require('../middleware/authenticate');
var router = express.Router();
const userServices = require("../services/userServices");
const userControllers = require('../controllers/userControllers');
const contentCreaterControllers = require('../controllers/contentCreaterControllers')
const dashboardController = require('../controllers/dashboardController');
const paintingController=require('../controllers/paintingController');
const authController = require('../controllers/authController');
const walletController=require('../controllers/walletController');
const kycController=require('../controllers/kycController');
const orderController=require('../controllers/orderController');
const categoryController=require('../controllers/CategoryController');
const PageController=require('../controllers/PageController');
const HomeController=require('../controllers/HomeController');
router.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.use(flash());


router.get('/login',authController.loginPage);
router.get('/signup',authController.signup);
router.post('/submitSignup',authController.submitSignup);
router.post('/login', authController.userLogin);
router.get('/logout',authController.logout);
router.get('/login-by-wallet',authController.loginByWallet);
router.post('/save-order',orderController.saveOrder);
router.post('/update-profile',authController.upload,authController.updateProfile);
router.get('/orders',orderController.userOrders);
router.get('/confirm-order',orderController.confirmOrder);
/* content creater  */
router.post('/contentCreater-login', contentCreaterControllers.login);
router.get('/wallet-balance',walletController.walletBalance);
//router.post('/contentCreater-signup', contentCreaterControllers.upload, contentCreaterControllers.submitContentCreater);

router.use(authenticate);

router.get('/dashboard',authController.dashboard);
router.get('/creaters',authController.getCreaters);
router.get('/accept',authController.acceptUser);
router.get('/reject',authController.rejectUser);
router.get('/create',dashboardController.createCotent);
router.post('/add-painting',paintingController.uploadFiles,paintingController.savePainting);
router.get('/paintings',paintingController.index);
router.post('/preview-content',paintingController.preview);
router.get('/serach-content',paintingController.searchContent);
router.get('/global-serach-content',paintingController.globalSearchContent);
router.get('/admin-global-serach-content',paintingController.adminGlobalSearchContent);

router.get('/update-content',paintingController.updateContentStatus);
router.get('/reject-content',paintingController.rejectContentStatus);

router.get('/edit-painting',paintingController.editPainting);
router.post('/update-painting',paintingController.upload,paintingController.updatePainting);
router.get('/delete-painting',paintingController.deletePainting);
router.get('/manage-kyc',dashboardController.manageKYC);
router.get('/manage-transactions',dashboardController.manageTransaction);
router.get('/mint-nft',paintingController.minftNft);

router.get('/add-nft',paintingController.signNft);

/*  wallet routes*/
router.get('/wallet',walletController.wallet);
router.get('/create-wallet',walletController.createWallet);
router.post('/verify-wallet',walletController.verifyWallet);
router.post('/submit-wallet',walletController.submitWallet);
router.get('/wallet-success',walletController.walletSuccess);

/* KYC */

router.get('/do-kyc',kycController.kyc);
router.post('/save-kyc',kycController.upload,kycController.saveKyc);
router.get('/kyc-list',kycController.kycList);

router.get('/view-kyc',kycController.viewKyc);
router.get('/approve-kyc',kycController.updateKycStatus);
router.get('/reject-kyc',kycController.rejectKycStatus);

router.get('/profile',authController.userProfile);

router.get('/password',authController.passwordPage);
router.post('/updatepassword',authController.updatePassword);

router.get('/category',categoryController.index);
router.get('/create-category',categoryController.create);
router.post('/save-category',categoryController.upload,categoryController.store);
router.get('/edit-category',categoryController.edit);
router.post('/update-category',categoryController.upload,categoryController.update);
router.get('/delete-category',categoryController.deleteCategory);
router.get('/privacy-policy',authController.privacyPage);
router.get('/terms-conditions',authController.termsPage);
 router.post('/create-page',PageController.cretaePage);
 router.get('/get-letters',HomeController.getNewsLetters);

module.exports = router;
