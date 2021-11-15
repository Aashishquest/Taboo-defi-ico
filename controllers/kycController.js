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



const signup= async (req,res)=> {
    res.render('users/register', { layout: 'layouts/front/layout' });

}

const kyc=async (req,res)=>{
    let user_id=req.session.re_us_id;
    let userKyc=await userServices.getKycBYId(user_id);
    if(userKyc.length>0)
      {
          console.log(userKyc);
        res.render('users/kyc/',{title:"KYC",role:req.session.role,userKyc,name:req.session.re_usr_name});

      }else{

        res.render('users/kyc/create.ejs',{title:"KYC",role:req.session.role,name:req.session.re_usr_name});


      }
}


const saveKyc=async (req,res)=>{
    let user_id=req.session.re_us_id;
    let image=req.file.filename;
    try
     {
        let userKyc=await userServices.saveKyc(image,user_id,req.body);
        
        req.flash('err_msg', 'Document Uploaded Successfully.');

        res.redirect('/users/do-kyc');
     }
    catch(error)
     {
        console.log(error);
     }
}


const kycList=async(req,res)=>{

    let userKyc=await userServices.getKycList();
    if(req.session.role!="admin"){
      res.redirect('/users/dashboard');
    }
    if(userKyc.length>0)
      {
          console.log(userKyc);
          res.render('admin/kyc/',{title:"KYC",role:req.session.role,userKyc,name:req.session.re_usr_name});

      }

}

const viewKyc=async(req,res)=>{

  let id=req.query.id.trim();
  let kyc =await userServices.getKycBYKycId(id);
  let user=await userServices.checkUserId(id);
  console.log(user);
  console.log(kyc);
  if(req.session.role!="admin"){
    res.redirect('/users/dashboard');
  }

  if(user)
    {
      res.render('admin/kyc/view',{title:'view kyc',user,kyc,role:req.session.role,name:req.session.re_usr_name});
    }

}
const submitSignup = async (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    let mobile = req.body.mobile;
    let username = req.body.username;
    
      console.log(req.body);
        if(name && email && password && username && mobile){
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
                req.flash('success_msg', 'Content Creater registered. Please verify to continue.');
              res.redirect('/users/login');
            }
        
        }
   
}

const updateKycStatus=async (req,res)=>{
   let id=req.query.id.trim();
   let status="Approved";
   
try{
    let  kyc=await userServices.updateKycStatus(id,status);
    let user=await userServices.checkUserByID(kyc.user_id);

       let subject = 'Taboo NFT KYC';
       //let text = 'Hello '+ user.name + ',<br><br>\n\n Congratulations your kyc is approved with The Taboo NFT website!<br><br>\n\n' +
       'If this withdrawal attempt was not made by you it means someone visited your account. It may be an indication you have been the target of a phishing attempt and might want to consider moving your funds to a new wallet.' + '<br><br>\n\n' + 'Regards,<br>\nTeam The Taboo NFT';
      
          let text=`<div style="max-width: 1000px; margin: 30px auto;font-family: sans-serif;">
          <div style="border: 1px solid #ddd;  ">
            <div style="margin-bottom: 30px; border-bottom: 2px solid #b30606; padding: 10px;">
              <img src="/logo-red.png" style="height: 60px;">
            </div>
            <div style="padding: 10px 20px 40px;">
              <h3 style="font-size: 20px;color: #b30606;margin-top: 0;">Hi `+ user.name+`,</h3>
              <p style="line-height: 30px;"><b>Congratulations! You have been approved as a content creator with Taboo Token!</b><br></p>
        
              <p>You embody the spirit of our platform. You are the kind of quality content creator we wish to represent our brand! If you have questions or concerns, please feel free to reach out to any team member, at any time, with questions, and we will work to help you with anything you need!</p>
        
              <p>You can now upload and list your NFTs, subject to prior approval.</p>
              <p>You can access the full marketplace. </p>
              <p>We will be in touch regarding possible future photoshoots and content creation opportunities.</p>
              <p>We will also be in touch regarding possible attendance at our VIP events. </p>
              
            </div>
            <footer style="background: #b30606;text-align:center;padding:20px 10px 30px;">
              <h2 style="margin-top: 0;font-size: 24px;color: #fff;margin-bottom:5px;position: relative">
              <span style="display: inline-block;padding: 0 14px;background: #b30606;position: relative;z-index: 2">Welcome to Taboo Token</span>
              <span style="position: absolute;width:450px;height: 1px;background: #fff;top: 50%;left: 50%;transform: translate(-50%,-50%);z-index: 1"></span>
              </h2>
              <h4 style="margin: 2px 0 0;font-size: 16px;line-height: 1.3;color: #fff;font-weight: 400">Yours Truly,</h4>
              <h3 style="margin: 0;font-size: 20px;line-height: 1.2; color: #fff;font-weight: bold">The Taboo Team</h3>
              
              
            </footer>
            
          </div>
        </div>`;


       try{
           await mail(user.email, subject, text);
       }catch(err){
           console.log(err);
       }
     res.redirect('/users/kyc-list');
   }catch(err)
    {
      console.log(err);
    }
}
const rejectKycStatus=async(req,res)=>{
  let id=req.query.id.trim();
  let status="Rejected";
  
try{
   let  kyc=await userServices.updateKycStatus(id,status);
   let user=await userServices.checkUserByID(kyc.user_id);

                let subject = 'Taboo NFT Signup';
                let text = 'Hello '+ user.name + ',<br><br>\n\n Sorry! Your kyc is rejected with The Taboo NFT website!<br><br>\n\n' +
                'If this withdrawal attempt was not made by you it means someone visited your account. It may be an indication you have been the target of a phishing attempt and might want to consider moving your funds to a new wallet.' + '<br><br>\n\n' + 'Regards,<br>\nTeam The Taboo NFT';
               
                try{
                    await mail(user.email, subject, text);
                }catch(err){
                    console.log(err);
                }
    res.redirect('/users/kyc-list');
  }catch(err)
   {
     console.log(err);
   }

}

module.exports = {
    upload,
    kyc,
    saveKyc,
    kycList,
    viewKyc,
    updateKycStatus,
    rejectKycStatus
};
