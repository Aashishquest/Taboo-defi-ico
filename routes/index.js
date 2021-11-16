var express = require('express');
var router = express.Router();
const HomeController=require('../controllers/HomeController');
const TransactionController=require('../controllers/TransactionController');
const BidController=require('../controllers/BidController');
const subscriptionController = require('../controllers/subscriptionControllers');
const authuser=require('../middleware/authuser');
/* GET home page. */
//router.use(authuser);
router.get('/',authuser,HomeController.index);
router.get('/place-bid',BidController.placeBid);

router.get('/explore',authuser,HomeController.explore);
router.get('/search',HomeController.exploreContent);
router.get('/global-search',HomeController.global_search)
router.get('/defi', function(req, res, next) {
  res.render('defi');
});
router.get('/farm', function(req, res, next) {
  res.render('farm',{ layout: 'layouts/front/layout',name: req.session.re_usr_name});
});
router.get('/buy-content',TransactionController.buyNft);

router.get('/model',authuser,HomeController.model);
router.get('/author',authuser,HomeController.author);
router.get('/contact',authuser, function(req, res, next) {
  res.render('contactus',{ layout: 'layouts/front/layout',name: req.session.re_usr_name });
});

router.get('/subscriptions',authuser,function(req,res){
  res.render('subscription',{layout:'layouts/front/layout',name: req.session.re_usr_name});
});

router.get('/subscribed',authuser,function(req,res){
   res.render('subscribed',{layout:'layouts/front/layout',name: req.session.re_usr_name});
});

router.get('/buy-plan',authuser,function(req,res){
  res.render('buy-plan',{layout:'layouts/front/layout',name: req.session.re_usr_name});
});
router.get('/item-details',authuser,HomeController.contentDetail);
router.get('/sale-nft',HomeController.soldNft);
router.get('/transfer-nft',HomeController.transferNFT);

router.post('/add-letters',HomeController.addNews);
router.get('/transactions',HomeController.transactionHistory);
router.get('/terms-conditions',HomeController.pageData);

router.get('/privacy-policy',HomeController.privacyPage);
router.post('/contact',HomeController.contact);
router.post('/subscription',subscriptionController.subscription);
router.get('/all-subscription',subscriptionController.getSubscription);
router.get('/subscription-by-id',subscriptionController.findByIdSubscription);
//router.post('/subscription-update',subscriptionController.updateSubscription);
module.exports = router;
