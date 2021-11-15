const { compareSync } = require("bcryptjs");
const moment = require('moment');
const request = require('request');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const paintingServices = require("../services/paintingServices");
const userServices = require("../services/userServices");
const blockchainServices = require("../services/blockchainServices");
const token = require('../helper/token');
const { JWT_SECRET_KEY } = require('../config/default.json');
const { mail } = require('../helper/mailer');
const { calculateHours } = require('../helper/userHelper');
const { balanceMainBNB, coinBalanceBNB } = require('../helper/bscHelper');
const { balanceMainETH } = require('../helper/ethHelper');
const { activationTokens } = require('../models/contact');
const contentCreaterServices = require("../services/contentCreaterServices");
const orderServices = require("../services/orderServices");
const categoryServices=require('../services/categoryServices');
const pageServices=require('../services/pageServices');
const transactionServices=require('../services/transactionServices');
const Storage = multer.diskStorage({
    destination:'./public/uploadFile',
    filename:(req,file,cb)=>{
      cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname))
    }
})

//middleware
const upload = multer({
    storage:Storage
}).single('file');

const loginPage = async (req, res) => {
       let err_msg = req.flash('err_msg');
       let success_msg=req.flash('success_msg');
    //let success_msg = req.flash('success_msg');
       let user_id=req.session.re_us_id;
       let role=req.session.role;

        if(user_id)
        {
            if(role=="user"){
                res.redirect('/');
            }else
              {
                  res.redirect('/users/dashboard');
              }
          
        }
        else
        {
            res.render('users/login', { layout: 'layouts/front/layout',err_msg:err_msg ,name: req.session.re_usr_name,success_msg:success_msg});

        }
    
}


const passwordPage = async (req, res) => {
    let err_msg = req.flash('err_msg');
    let success_msg=req.flash('success_msg');
 //let success_msg = req.flash('success_msg');
    let user_id=req.session.re_us_id;
    let role=req.session.role;

     if(user_id)
     {
        res.render('users/creaters/change-password',{title:"Dashboard",role:req.session.role,name:req.session.re_usr_name,success_msg} );
       
     }
     else
     {
        res.redirect('/');
     }
 
}

const signup= async (req,res)=> {
    let err_msg = req.flash('err_msg');
    
       let user_id=req.session.re_us_id;
       let role=req.session.role;

        if(user_id)
        {
            if(role=="user"){
                res.redirect('/');
            }else
              {
                  res.redirect('/users/dashboard');
              }
          
        }
        else
        {

            res.render('users/register', { layout: 'layouts/front/layout',name: req.session.re_usr_name,err_msg});

        }



}



const userLogin = async (req, res) => {
    //console.log(req.body)
    let user = await userServices.checkUser(req.body.email);
    let password = req.body.password.trim();
    let mystr = await userServices.createCipher(password);
    if (user) {
        if (user.email_verified == true) {
            let wallet = { success: 0, msg: "Account not activated please activate account before login" };
            let wallet_details = JSON.stringify(wallet);
            return res.send(wallet_details);
        }
        userObject = {
            name: user.name,
            email: user.email,
            created_at: user.created_at,
            mobile: user.mobile,
            role: user.user_role,
            status: user.status,
        }
        let userLogin = await userServices.checkUserPass(req.body.email.trim(), mystr);
        if (userLogin) {
            if (userLogin.status == 'active' ) 
             {
                req.session.success = true;
                req.session.re_us_id = userLogin._id;
                req.session.re_usr_name = userLogin.name;
                req.session.re_usr_email = userLogin.email;
                req.session.is_user_logged_in = true;
                req.session.role=userLogin.user_role;
                req.session.is_approved=userLogin.isApproved;
                console.log(req.session);
                res.redirect('/users/dashboard');
            } 
            else 
            {
                req.flash('err_msg', 'Your account is not active.');
                res.redirect('/users/login')
            }
        }
        else {
            req.flash('err_msg', 'The username or password is incorrect.');
            res.redirect('/users/login');
           
        }
    }
    else {
        //let message = { success: 0, msg: "Email address does not exist." };
        req.flash('err_msg', 'Email does not exist.');
        res.redirect('users/login');
    }
}


const submitSignup = async (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    let mobile = req.body.mobile;
   // let username = req.body.username;
    
      console.log(req.body);
        if(name && email && password && mobile){
            let user = await userServices.checkUser(req.body.email);
            console.log(user);
            if (user) 
             {
                req.flash('err_msg', 'Email already exists. Please enter another email.');
                res.redirect('/users/signup');
            }
            else {
                let mystr = await contentCreaterServices.createCipher(req.body.password);
                let created = await contentCreaterServices.createAtTimer();
                let newuser = await userServices.addUser(req.body, mystr, created);
                let user = await userServices.checkUser(req.body.email);
                //let activationmail = await userServices.sendActivationMail(user, req)
                console.log(user);
                let otp="";
                let subject = 'Taboo NFT Signup';
                //let text = 'Hello '+ req.body.name + ',<br><br>\n\nCongratulations on signing up with The Taboo NFT website!<br><br>\n\n' +
                'If this withdrawal attempt was not made by you it means someone visited your account. It may be an indication you have been the target of a phishing attempt and might want to consider moving your funds to a new wallet.' + '<br><br>\n\n' + 'Regards,<br>\nTeam The Taboo NFT';
                
                let text=`<div style="max-width: 1000px; margin: 30px auto;font-family: sans-serif;">
                <div style="border: 1px solid #ddd;  ">
                    <div style="margin-bottom: 30px; border-bottom: 2px solid #b30606; padding: 10px;">
                        <img src="/logo-red.png" style="height: 60px;">
                    </div>
                    <div style="padding: 10px 20px 40px;">
                        <h3 style="font-size: 20px;color: #b30606;margin-top: 0;">Hi `+ req.body.name +`,</h3>
                        <p style="line-height: 30px;"><b>Thank you for signing up to be a content creator with Taboo Token, the Playboy of Crypto!</b><br></p>
            
                        <p>The team has received your sign-up information and will be reviewing it closely. If you meet our qualifications, a team member will reach back out to you! We appreciate your interest and look forward to reviewing your information!</p>
                        <p>If there is anything else you think we need to know, feel free to email us at <a href="" style="color: #b30606;">info@taboo.community!</a> </p>
            
            
            
            
                        
                    </div>
                    <footer style="background: #b30606;text-align:center;padding:20px 10px 30px;">
                        <h2 style="margin-top: 0;font-size: 24px;color: #fff;margin-bottom:5px;position: relative">
                        <span style="display: inline-block;padding: 0 14px;background: #b30606;position: relative;z-index: 2">Thanks &  Regards</span>
                        <span style="position: absolute;width:450px;height: 1px;background: #fff;top: 50%;left: 50%;transform: translate(-50%,-50%);z-index: 1"></span>
                        </h2>
                        <h4 style="margin: 2px 0 0;font-size: 16px;line-height: 1.3;color: #fff;font-weight: 400">Yours Truly,</h4>
                        <h3 style="margin: 0;font-size: 20px;line-height: 1.2; color: #fff;font-weight: bold">The Taboo Team</h3>
                        
                        
                    </footer>
                    
                </div>
            </div>`


                try{
                    await mail(req.body.email, subject, text);
                }catch(err){
                    console.log(err);
                }


                req.flash('success_msg', 'You are registered successfully. Please login to continue.');
              res.redirect('/users/login');
            }
        
        }
   
}


const logout = async (req, res) => {
    req.session.destroy();
    res.redirect('/');
}


const loginByWallet=async(req,res)=>{
    let address=req.query.account;
    let balance=await transactionServices.getTabooBalance(address);
    balance=parseInt(balance);
    balance=balance/1000000000000000000;
    console.log(balance);
    balance = await transactionServices.tabooRate(balance)
    console.log(address);
    console.log("user balance",balance);
    if(address=="undefined"||address==""||address==null){
       
        res.send(false);
  
     }else{
         let tier="";
         if(balance>=1000 && balance<5000){
            tier="2 Tier";
          }
         else if(balance>=5000){
             tier="3 Tier"
         }
         else
           {
               tier="1 Tier";
           }
         console.log(tier);
         let user=await userServices.checkUserByWallet(address);
         console.log("user account",user);
         if(user){
             let user=await userServices.updateTier(address,tier);
             req.session.success = true;
             req.session.re_us_id = user._id;
             req.session.re_usr_name = user.name;
             req.session.re_usr_email = user.email;
             req.session.is_user_logged_in = true;
             req.session.role=user.user_role;
             req.session.subscription=user.subscription;

             console.log(req.session);
             res.send(user);
         }else
           {
             let email=address+"@gmail.com";
              let mystr = await contentCreaterServices.createCipher("123456");
              let created = await contentCreaterServices.createAtTimer();
               userOBJ={ name:address,
                        email:email,
                        password:mystr,
                        username:"metamask",
                        mobile:"1234567898",
                        wallet_address:address,
                        user_role:"user",
                        subscription:tier,
                        created_at:created  
                        }
                      
              
              let newuser = await userServices.addUserByWallet(userOBJ);
              let user=await userServices.checkUserByWallet(address);
     
     
              req.session.success = true;
              req.session.re_us_id = user._id;
              req.session.re_usr_name = user.name;
              req.session.re_usr_email = user.email;
              req.session.is_user_logged_in = true;
              req.session.role=user.user_role;
              req.session.subscription=user.subscription;

              console.log(req.session);
     
              res.send(user);
           }
     }
    
}

const updateProfile=async(req,res)=>{
    let image="";
    let user_id=req.session.re_us_id;
    console.log(req.file);
      if(!req.file){
            
        image=req.body.old_image;
    
      }
      else
      {
         image= req.file.filename;

      }

     let user=await userServices.updateProfile(image,user_id,req.body);
      console.log(user);
      res.redirect('/users/profile');

}

const privacyPage=async(req,res)=>{
    let page=await  pageServices.findPageByName('privacy');
    res.render('admin/privacy/create',{role:req.session.role,name:req.session.re_usr_name,page:page});
}

const termsPage=async(req,res)=>{
    let page=await  pageServices.findPageByName('terms');

    res.render('admin/terms-conditions/create',{role:req.session.role,name:req.session.re_usr_name,page:page});
}

const userProfile=async(req,res)=>{

    let id=req.session.re_us_id;

    let user= await userServices.checkUserId(id);

    console.log("user profile",user);

    res.render('users/creaters/update-profile',{title:"profile",user:user,role:req.session.role,name:req.session.re_usr_name});

}

const activateAccount = async (req, res) => {
    let email = req.body.email;
    let user = await userServices.checkUser(email)
    if (user) {
        let mail = await userServices.sendActivationMail(user, req)
        let wallet = { success: 1, msg: "We have sent an activation mail to your registered mail." };
        let wallet_details = JSON.stringify(wallet);
        res.send(wallet_details);
    }
    else {
        let wallet = { success: 0, msg: "Email address does not exist." };
        let wallet_details = JSON.stringify(wallet);
        res.send(wallet_details);
    }
}

const activateUser = async function (req, res) {
    const tokenId = req.params.id
    console.log(tokenId)
    let token = await activationTokens.findOne({ '_id': tokenId });
    if (token) {
        let activate = await userServices.updateUserStatus(token._userId)
        if (activate) {
            let wallet = { success: 1, msg: "Account activted successfully" };
            let wallet_details = JSON.stringify(wallet);
            res.send(wallet_details);
        }
        else {
            let wallet = { success: 0, msg: "Something went wrong please try later" };
            let wallet_details = JSON.stringify(wallet);
            res.send(wallet_details);
        }
    }
    else {
        let wallet = { success: 0, msg: "Activation link deactivated Please resend detials to get activation mail." };
        let wallet_details = JSON.stringify(wallet);
        res.send(wallet_details);
    }
}

const dashboard=async (req,res)=>{
    let user_id=req.session.re_us_id;
    let role=req.session.role;
    let loginwallet = await blockchainServices.importWalletFindId(user_id);
    console.log("login wallet",loginwallet)
    let total= await paintingServices.totalContent(user_id,role);
    let total_for_sale=await paintingServices.totalContentForSale(user_id,role);
    let total_pending=await paintingServices.totalPendingContent(user_id,role);
    let total_creater=await userServices.totalCreators();
    let total_earning=await transactionServices.findByUserId(user_id);

    console.log("earning",total_earning)
    if(role=="admin")
      {
        let category=await categoryServices.findAllCategory();

        res.render('admin/dashboard/',{title:"Dashboard",role:req.session.role,name:req.session.re_usr_name,total,total_for_sale,total_pending,total_creater,total_earning,category:category});
      }
     else
     {
        if(loginwallet){

            let contents=await paintingServices.paintingList(user_id);
            let category=await categoryServices.findAllCategory();

            res.render('users/dashboard',{title:"Dashboard",role:req.session.role,contents,name:req.session.re_usr_name,total,total_for_sale,total_pending,total_earning,category:category});

        }else{
            res.redirect('/users/create-wallet');
        }
     }
}
const getCreaters=async(req,res)=>{
    let users= await userServices.creaters();
    console.log(users);
    res.render('users/creaters/',{title:"Creaters",role:req.session.role,users:users,name:req.session.re_usr_name});
}
const acceptUser=async (req,res)=>{
     let id=req.query.id.trim();
     console.log("user id",id);
     let status="active";
     let user=await userServices.checkUserByID(id);
     console.log(user);
     if(user){
        let user= await userServices.updateAccount(id,status);

              let subject = 'Taboo NFT Signup';
                let text = 'Hello '+user.name + ',<br><br>\n\n Your Account has been actived with The Taboo NFT website!<br><br>\n\n' +
                'If this withdrawal attempt was not made by you it means someone visited your account. It may be an indication you have been the target of a phishing attempt and might want to consider moving your funds to a new wallet.' + '<br><br>\n\n' + 'Regards,<br>\nTeam The Taboo NFT';
               
                try{
                    await mail(user.email, subject, text);
                }catch(err){
                    console.log(err);
                }
        res.redirect('/users/creaters');
     }
     else
     {
         console.log("record not found");
     }

}


const rejectUser=async (req,res)=>{
    let id=req.query.id.trim();
    console.log("user id",id);
    let status="inactive";
    let user=await userServices.checkUserByID(id);
    console.log(user);
    if(user){
       let user= await userServices.updateAccount(id,status);

       let subject = 'Taboo NFT Signup';
       let text = 'Hello '+ user.name + ',<br><br>\n\n Your Account has been deactived with The Taboo NFT website!<br><br>\n\n' +
       'If this withdrawal attempt was not made by you it means someone visited your account. It may be an indication you have been the target of a phishing attempt and might want to consider moving your funds to a new wallet.' + '<br><br>\n\n' + 'Regards,<br>\nTeam The Taboo NFT';
      
       try{
           await mail(user.email, subject, text);
       }catch(err){
           console.log(err);
       }

       res.redirect('/users/creaters');
    }
    else
    {
        console.log("record not found");
    }

}

const forgetPassword = async (req, res) => {
    let user = await userServices.checkUser(req.body.email);
    if (!user) {
        let wallet = { success: 0, msg: "Email address does not exist." };
        let wallet_details = JSON.stringify(wallet);
        res.send(wallet_details);
    }
    else {
        let new_pass = Math.random().toString(36).slice(-6);
        console.log(new_pass, '----------new_pass');
        let mystr1 = await userServices.createCipher(new_pass);
        let userUpdated = await userServices.updateUserPassword(req.body.email, mystr1);
        if (userUpdated) {
            let passwordmail = await userServices.sendNewPasswordMail(req, new_pass, userUpdated._id)
            let wallet = { success: 1, msg: "Password mail sent to registered email" };
            let wallet_details = JSON.stringify(wallet);
            res.send(wallet_details);
        }
        else {
            let wallet = { success: 0, msg: "An error occured." };
            let wallet_details = JSON.stringify(wallet);
            res.send(wallet_details);
        }
    }
}

const updatePassword = async (req, res) => {
    let user_id = req.session.re_us_id;
    console.log(req.body.password)
    let newpassword = await contentCreaterServices.createCipher(req.body.password);

    try{

        let user=await userServices.updateUserPasswordID(user_id,newpassword);
        
        req.flash('success_msg', 'Password changed successfully.');
 
       res.redirect('/users/password')
    }catch(err){
        console.log(err);
    }
   
}

module.exports = {
    upload,
    userLogin,
    activateAccount,
    activateUser,
    loginPage,
    forgetPassword,
    logout,
    signup,
    dashboard,
    submitSignup,
    getCreaters,
    acceptUser,
    rejectUser,
    loginByWallet,
    userProfile,
    updateProfile,
    updatePassword,
    updatePassword,
    passwordPage,
    privacyPage,
    termsPage
};
