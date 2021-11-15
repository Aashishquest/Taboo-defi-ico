const { compareSync } = require("bcryptjs");
const moment = require('moment');
const request = require('request');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const userServices = require("../services/userServices");
const blockchainServices = require("../services/blockchainServices");
const token = require('../helper/token');
const { JWT_SECRET_KEY } = require('../config/default.json');
const { mail } = require('../helper/mailer');
const { calculateHours } = require('../helper/userHelper');
const { balanceMainBNB, coinBalanceBNB } = require('../helper/bscHelper');
const { balanceMainETH } = require('../helper/ethHelper');
const { activationTokens } = require('../models/contact');
const orderServices=require('../services/orderServices');
const categoryServices=require('../services/categoryServices');


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

const createCotent=async (req,res)=>{
    
    if(req.session.is_approved=="Approved")
    {
        let category=await categoryServices.findAllCategory();
        console.log(req.session)
        res.render('users/creaters/create',{title:"Dashboard",role:req.session.role,name:req.session.re_usr_name,category:category});
    }
    else
    {
        res.render('users/creaters/NotAllow',{title:"Deny",role:req.session.role,name:req.session.re_usr_name});
    }
   
}

const manageKYC=async (req,res)=>{
    res.render('admin/kyc/',{role:req.session.role,name:req.session.re_usr_name});

}

const manageTransaction=async (req,res)=>{
     let start_date= req.query.start_date;
     let end_date= req.query.end_date;
     let orders="";
     if(start_date && end_date){
        orders=await orderServices.getOrders(start_date,end_date);

       }else
         { let start_date=""; let end_date="";
           orders=await orderServices.getOrders(start_date,end_date);

         }
     console.log(orders);
    res.render('admin/transactions/',{role:req.session.role,name:req.session.re_usr_name,orders:orders});
    
}

module.exports = {
    createCotent,
    manageKYC,
    manageTransaction
};
