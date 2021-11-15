const { compareSync } = require("bcryptjs");
const moment = require('moment');
const request = require('request');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const { mail } = require('../helper/mailer');
const orderServices=require('../services/orderServices');
const userServices = require('../services/userServices')
const contentCreaterServices=require('../services/contentCreaterServices');
const paintingServices = require("../services/paintingServices");
const mintServices=require('../services/mintServices');
const transactionServices=require('../services/transactionServices');
const blockchainServices = require("../services/blockchainServices");

const base_url = process.env.BASE_URL;

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

const saveOrder=async(req,res)=>{
    let address=req.body.address;
    let amount=req.body.amount;
    let user=await userServices.checkUserByWallet(address);
    let content=await paintingServices.getContentDetail(req.body.content_id);
    let hash=req.body.tx_id;
    let user_id="";
    if(user){
        user_id=user._id;
        req.session.success = true;
        req.session.re_us_id = user._id;
        req.session.re_usr_name = user.name;
        req.session.re_usr_email = user.email;
        req.session.is_user_logged_in = true;
        req.session.role=user.user_role;
      }
    else
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
                   created_at:created  
                   }

                   let newuser = await userServices.addUserByWallet(userOBJ);
                   let user=await userServices.checkUserByWallet(address);
                   user_id=user._id;
                   req.session.success = true;
                   req.session.re_us_id = user._id;
                   req.session.re_usr_name = user.name;
                   req.session.re_usr_email = user.email;
                   req.session.is_user_logged_in = true;
                   req.session.role=user.user_role;      
      }
    
      let order={
              user_id:user_id,
              content_id:req.body.content_id,
              creator_id:content.created_by,
              trans_id:hash,
              user_wallet_address:req.body.address,
              total:req.body.amount,
              status:"success"
              } 
     try{
         let fees=req.body.fees;

        let orderData=await orderServices.saveOrder(order);
        let admin=await userServices.findAdmin();
         fees=parseInt(fees);
        let basic_price=parseInt(amount);
        let platform_fees=(basic_price*fees)/100;
        let creator_amount=basic_price-platform_fees;
        let tx=await transactionServices.add({user_id:content.created_by,amount:creator_amount});
  
        let tx2=await transactionServices.add({user_id:admin._id,amount:platform_fees})
        let userwallet = await blockchainServices.findUserWallet(content.created_by);
         
       console.log("user allet",userwallet) 
       req.session.userWallet=userwallet;
       req.session.sendAmount=creator_amount;         
        console.log(tx);
        console.log(tx2)
        res.send(orderData);
     }catch(err){
         console.log(err);
     }
    

}

const confirmOrder=async(req,res)=>{
  let order_id=req.query.order_id.trim();

  let orderdetail=await orderServices.findOrder(order_id);
  console.log(orderdetail)
  let content=await paintingServices.getContentDetail(orderdetail.content_id);
  console.log(content);
  let tokenUrl=base_url+'/uploadFile/'+content.image;
  let tokenId="";
  let user=await userServices.checkUserByID(content.created_by);
    try
     { 
       let mintData=await mintServices.findMintDetail(content._id);
      
       let nftDetail=await mintServices.getTokenOwned(mintData.wallet_address);

       console.log("mint data",mintData);
       console.log(nftDetail)
        for(let i=0;i<content.copy_for_sale;i++){
              let j=i+1;
              if(nftDetail[1][i]==tokenUrl){
                 tokenId=nftDetail[0][i];
                 break;
                }
       }

      await mintServices.transferNFT(mintData.wallet_address,orderdetail.user_wallet_address,tokenId,tokenUrl,user.private_key);
      
      await orderServices.updateOrder(order_id);
      res.send(true);
    }catch(err){
        console.log(err);
    }
}


const userOrders=async(req,res)=>{
    let user_id=req.session.re_us_id;
    let orders=await orderServices.findOrderByID(user_id);
    res.render('users/orders/index',{role:req.session.role,name:req.session.re_usr_name,orders})
}

module.exports={
    saveOrder,
    userOrders,
    confirmOrder
};
