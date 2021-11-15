const { compareSync } = require("bcryptjs");
const moment = require('moment');
const request = require('request');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const paintingServices = require("../services/paintingServices");
const blockchainServices = require("../services/blockchainServices");
const userServices = require("../services/userServices");
const token = require('../helper/token');
const { JWT_SECRET_KEY } = require('../config/default.json');
const { mail } = require('../helper/mailer');
const { calculateHours } = require('../helper/userHelper');
const { balanceMainBNB, coinBalanceBNB } = require('../helper/bscHelper');
const { balanceMainETH } = require('../helper/ethHelper');
const { UserInfo } = require("../models/userModel");
const { ContactInfo } = require("../models/contactusModel");
const categoryServices=require('../services/categoryServices');
const signNftServices=require('../services/signNftServices');
const orderServices=require('../services/orderServices');
const pageServices=require('../services/pageServices');
const transactionServices=require('../services/transactionServices');

function authuser(req, res, next) {
    if (req.session&&req.session.role) 
      {
        if(req.session.role!="user")
        {
            res.redirect('/users/dashboard');

        }
      }
      
    next();
}


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

const explore=async (req,res)=>{
       let category= await categoryServices.findAllCategory();
       let totalContent=paintingServices.totalContent();
        res.render('explore',{ layout: 'layouts/front/layout',totalContent:totalContent,name:req.session.re_usr_name,category:category,session:req.session});
}
const index=async(req,res)=>{
     let query="";
     let users= await userServices.creaters();
    let content = await paintingServices.getpaintingList(query);
    var containtArr=[]
    for(key of content){
     let details=await paintingServices.getContentDetail(key._id);
     let nftToken=await signNftServices.findByIdVoucher(key._id);
     key.nftToken = nftToken
     key.details = details
     containtArr.push(key)
    }
    console.log('index containtArr:',containtArr)
    res.render('index',{layout:'layouts/front/layout',users:users,name: req.session.re_usr_name,content,containtArr ,session:req.session})
}
const exploreContent=async(req,res)=>{
    let query=req.query.category;
    let sortby=req.query.sortby;
    console.log(query); console.log('=======sort by',sortby);
    let content = await paintingServices.getpaintingList(query,sortby);
   console.log('content====================',content)
   var containtArr=[]
   for(key of content){
    let details=await paintingServices.getContentDetail(key._id);
    let nftToken=await signNftServices.findByIdVoucher(key._id);
    console.log('nftToken:',nftToken)
    key.nftToken = nftToken
    key.details = details
    containtArr.push(key)
   }
   console.log('containtArr',containtArr)
    res.send(containtArr);

}

const global_search=async(req,res)=>{
    console.log('g search session',req.session)
    painting=await paintingServices.nftSearchList(req.query.quick_search);
    console.log('my search data==========',painting)
    var containtArr=[]
    for(var key of painting){
        var t = JSON.stringify(key)
        var temp = JSON.parse(t)
    let users      = await userServices.checkUserId(temp.created_by[0]);
     let details=await paintingServices.getContentDetail(temp._id);
     let nftToken=await signNftServices.findByIdVoucher(temp._id);
     console.log('nftToken:',nftToken)
     temp.nftToken = nftToken
     temp.details = details
     console.log('users===========',users)
     
     temp.user = users
     containtArr.push(temp)
    }
    console.log('containt global search========++++++++++++======',containtArr)
    //res.send(painting);
    res.render('global-search',{layout:'layouts/front/layout',content:containtArr,name:req.session.re_usr_name,session:req.session});
   

}
const model=async (req,res)=>{
     console.log('model session',req.session)
    res.render('models',{ layout: 'layouts/front/layout',name:req.session.re_usr_name,session:req.session});

}
const contentDetail=async(req,res)=>{
    let query="";
    let id=req.query.id.trim();
    let details=await paintingServices.getContentDetail(id);
    let creater=await userServices.checkUserByID(details.created_by);
    let nftToken=await signNftServices.findByIdVoucher(details._id);
    let category=await categoryServices.findCategoryByName(details.category);
    let users= await userServices.creaters();
    let content = await paintingServices.getpaintingList(query);
  
       var containtArr=[]
       for(key of content){
        let details1=await paintingServices.getContentDetail(key._id);
        let nftToken=await signNftServices.findByIdVoucher(key._id);
        key.nftToken = nftToken
        key.details = details1
        containtArr.push(key)
       }
       console.log('index containtArr:',containtArr)
    res.render('nft-detail',{layout:'layouts/front/layout',category:category,nftToken:nftToken,details,creater,name:req.session.re_usr_name,users:users,content:content,containtArr:containtArr,session:req.session});
}

const transferNFT=async(req,res)=>{
    let hash=req.query.hash.trim();
    let orders=await orderServices.findOrderByHash(hash);
    console.log(orders.content_id);
    if(orders){
        req.session.tx_id=hash;
        let details=await paintingServices.getContentDetail(orders.content_id);
        let creater=await userServices.checkUserByID(details.created_by);
        let nftToken=await signNftServices.findByIdVoucher(details._id);
        res.render('nft-transfer',{layout:'layouts/front/layout',nftToken:nftToken,details,creater,name:req.session.re_usr_name});
        
    }else
      {
          res.send('Sorry!,Something  went wrong.');
      }
   
}

const author=async(req,res)=>{
    let author_id = req.query.id.trim();
    let user      = await userServices.checkUserId(author_id);
    let content   = await paintingServices.autherContent(author_id);
    var containtArr=[]
    for(key of content){
        var temp  = JSON.stringify(key)
        var temp1 = JSON.parse(temp)
     let nftToken = await signNftServices.findByIdVoucher(key._id);
     let details=await paintingServices.getContentDetail(key._id);
     let users      = await userServices.checkUserId(key.created_by[0]);
     console.log('nftToken:',nftToken)
     console.log('details:',details)
     temp1.nftToken = nftToken
     temp1.details = details
     temp1.user = users
     containtArr.push(temp1)
    }
    console.log('containt:::=',containtArr)
    console.log('author session',req.session)
    res.render('author',{ layout: 'layouts/front/layout',session:req.session,name:req.session.re_usr_name,content:containtArr,user:user});
}

const soldNft=async(req,res)=>{
    let id=req.query.id.trim();
    let hash=req.query.hash;
    let tx_id=req.session.tx_id;
    try{ 
        let nft=await signNftServices.updateNftStatus(id);
        await orderServices.updateNftHash(tx_id,hash.hash);
        let userwallet= req.session.userWallet;
        let amount=req.session.sendAmount;
        await transactionServices.transferTaboo(userwallet.wallet_address,amount);

        res.send(nft);
    }catch(e){console.log(e);}

}


const addNews=async(req,res)=>{
  let email=req.body.email;
  let news=await userServices.addNewsLetter(email);

  res.send({status:true,data:news})
  //res.redirect('/');
}

const getNewsLetters=async(req,res)=>{
    let news=await userServices.findNewsLetter();

    res.render('admin/news-letters/index',{role:req.session.role,name:req.session.re_usr_name,news})

}

const pageData=async(req,res)=>{
    let name="terms";
    let conditions= await pageServices.findPageByName(name);

    res.render('terms-conditions',{layout:'layouts/front/layout',name:req.session.re_usr_name,content:conditions})
}

const privacyPage=async(req,res)=>{
    let name="privacy";
    let conditions= await pageServices.findPageByName(name);

    res.render('privacy',{layout:'layouts/front/layout',name:req.session.re_usr_name,content:conditions})
}

const  transactionHistory=async(req,res)=>{
    let user_id=req.session.re_us_id;
    let transaction=await orderServices.findOrderByUser(user_id);
    console.log(transaction);
    res.render('users/transactions/index',{layout:'layouts/front/layout',name:req.session.re_usr_name,tx:transaction})
}
const contact=async(req,res)=>{
    console.log(req.body)
   var obj= {
       name : req.body.name,
       email: req.body.email,
       phone: req.body.phone,
       message: req.body.message,
    }
          var saveinfo= new ContactInfo(obj)
          saveinfo.save().then((responce)=>{
              console.log('contactus resp:',responce)
              if(responce){
                  res.send({
                    sent:'sent'
                  })
              }
          })
    }
module.exports = {
    explore,
    exploreContent,
    model,
    contentDetail,
    index,
    author,
    authuser,
    soldNft,
    transferNFT,
    addNews,
    pageData,
    transactionHistory,
    privacyPage,
    getNewsLetters,
    global_search,
    contact
};
