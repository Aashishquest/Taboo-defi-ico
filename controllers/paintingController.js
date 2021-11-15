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
const mintServices=require('../services/mintServices');
const ipfsSevices=require('../services/ipfsServices');
const categoryServices=require('../services/categoryServices');
const signNftServices=require('../services/signNftServices');

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

const uploadFiles = multer({ storage : Storage }).array('file',4);



const index=async (req,res)=>{
    let created_by=req.session.re_us_id;
    let painting=await paintingServices.paintingList(created_by);
    if(painting){
        res.render('users/creaters/painting-list',{role:req.session.role,painting:painting,name:req.session.re_usr_name})
    }
}
const globalSearchContent=async(req,res)=>{
     console.log('ssssssssssssssss',req.query)
     //return false
     painting=await paintingServices.nftSearchList(req.query.search_data);
     console.log('my search data',painting)
     res.send(painting);
}
const adminGlobalSearchContent=async(req,res)=>{
    console.log('ssssssssssssssss',req.query)
    //return false
    painting=await paintingServices.adminNftSearchList(req.query.search_data);
    console.log('my search data',painting)
    res.send(painting);
}

const searchContent=async(req,res)=>{
    let category=req.query.category;
    let basic_price=req.query.basic_price;

    console.log(category);
   

    let created_by=req.session.re_us_id;
    let painting="";
    if(req.session.role=="creater"){
        console.log('========basic_price',basic_price)
        painting=await paintingServices.paintingList(created_by,category,basic_price);
        console.log('------------------------',painting)
    }
    else
     {
        painting=await paintingServices.allpaintingList(category,basic_price);

     }
    

    res.send(painting);

}

const savePainting = async (req, res) => {
   
    
        console.log('==================',req.body); console.log("body",req.body.preview);
        //return false
         if(req.body.preview=="preview")
          { 
           console.log('uploaded files',req.files);
           let media_type=req.files[0].mimetype.split("/","2");
           console.log(media_type);
           let pr_image= req.files[0].filename;
           req.session.media_type=media_type;
           req.session.preview_image=pr_image;
           req.session.files=req.files;
           req.session.fordata=req.body; 
           res.render('users/creaters/preview',{title:"preview",data:req.body,role:req.session.role,image:pr_image,name:req.session.re_usr_name,files:req.files});
            
          }
         else
         {
           
                //let painting = await paintingServices.checkPainting(req.body.title);
                console.log(req.body);
                let painting=false;
                if (painting) 
                 {
                    req.flash('err_msg', 'Title already exists');
                    res.redirect('/users/create');
                }
                else {
    
                    let created="30-08-2021";
                    let created_by=req.session.re_us_id;
                    let image="";
                    let ContentData="";
                    let media_type="";
                    if(req.session.preview_image){
                       image=req.session.preview_image;
                       ContentData=req.session.fordata;
                       media_type=req.session.media_type;
                      }else{
                        image = req.files[0].filename;
                        ContentData=req.body;
                         media_type=req.files[0].mimetype.split("/","2");
                        console.log(media_type);
                      }
                    console.log(created_by)
                    try{
    
                        let painting = await paintingServices.addPainting(ContentData,created,created_by,image,media_type);
                         console.log("created successfully",painting);
                         req.session.painting=painting;  

                         let files="";
                         if(req.session.files){
                             files=req.files;
                         }else
                         {
                             files=req.files;
                         }
                         
                         let content_id=painting._id;
                         files.forEach( async function(file,index)
                           {
                            let media_type=file.mimetype.split("/","2");
                            
                            console.log(media_type);
                             let content_media=await paintingServices.saveContentMedia(content_id,file.filename,media_type);
                             console.log(content_media);
                           });


                    }catch(err){ console.log(err)}
                   // let user = await userServices.checkUser(req.body.email);
                    //let activationmail = await userServices.sendActivationMail(user, req)
                    console.log(painting);
                  req.flash('success_msg', 'Content Created Successfully.');
                  res.redirect('/users/mint-nft');
  
                }
            
            
         }
   
}

const minftNft=async(req,res)=>{
   
   let painting=req.session.painting;
    console.log("mint nft",painting);
   res.render('admin/nft/mint-nft',{role:req.session.role,painting:painting,name:req.session.re_usr_name});


}

const updateContentStatus=async (req,res)=>{
    const id=req.query.id.trim();
    let status="approved";
     
    let content=await paintingServices.updateContentStatus(id,status);
    
    let contentDetail=await paintingServices.getContentDetail(id);

     let UserwalletData = await blockchainServices.findUserWallet(contentDetail.created_by);
   console.log("paiting data",content);
    if(content){

        let content=await paintingServices.getContentDetail(id);

         //let imageUrl=base_url+'/uploadFile/'+content.image;
         // let data={"title":content.title,"image":imageUrl};
          
            //let tokenUrl=await ipfsSevices.addIPFS(data)
            //base_url+'/uploadFile/'+content.image;
           let tokenId=Math.floor(Math.random() * 10000);

          let tokenUrl=base_url+'/uploadFile/'+content.image;

          // await mintServices.mintNFT(UserwalletData.wallet_address,content._id,content.copy_for_sale,tokenUrl,content.title,content.basic_price);
          const voucher={tokenId:tokenId,minPrice:content.basic_price,tokenUrl:tokenUrl};
          let  signVoucher=await signNftServices.SignData(voucher);
         
            console.log(signVoucher);

           res.redirect('/users/dashboard');
     }

}


const rejectContentStatus=async (req,res)=>{
    const id=req.query.id.trim();
    let status="rejected";
     
    let content=await paintingServices.updateContentStatus(id,status);
    
    //let contentDetail=await paintingServices.getContentDetail(id);

    res.redirect('/users/dashboard');
    
}

const preview=(req,res)=>{

     res.render('users/creaters/preview',{title:"preview",data:req.body,name:req.session.re_usr_name});

}
const deletePainting=async (req,res)=>{
    let id=req.query.id.trim();
     
    try{

       await paintingServices.deletePainting(id);
    
       res.redirect('/users/paintings')
    

    }catch(error){
        console.log(error);
    }
     
}

const editPainting=async (req,res)=>{
    let id=req.query.id.trim();
    let painting=await paintingServices.getPainting(id);
    let files=await paintingServices.getContentMedia(painting._id);

    console.log(files);
    let category=await categoryServices.findAllCategory();

    if(painting){
        if(req.session.role=="admin")
         {
            res.render('admin/nft/edit',{role:req.session.role,category:category,painting:painting,name:req.session.re_usr_name,files});

         }else
         {
            res.render('users/creaters/edit-painting',{role:req.session.role,category:category,painting:painting,name:req.session.re_usr_name,files});

        }
    }else
    {
        console.log("There is no such record");
    }
}

const updatePainting=async (req,res)=>{
    let id=req.body.id;
    //let { id } = req.payload;
    console.log('record to update',req.body);
    //console.log('update=========================',req.body);
    //return false

    if(req.body.preview=='preview'){
        console.log('uploaded files',req.files);
        if(!req.file){
         req.session.preview_image=req.body.old_image;
        }else{
          req.session.preview_image=req.body.old_image;
          let media_type=req.files[0].mimetype.split("/","2");
          console.log(media_type);
          let pr_image= req.files[0].filename;
          req.session.media_type=media_type;
          req.session.preview_image=pr_image;
          req.session.files=req.files;
        }
        
        
        req.session.fordata=req.body; 
        res.render('users/creaters/update-preview',{title:"preview",data:req.body,role:req.session.role,image:req.body.old_image,name:req.session.re_usr_name,id:req.body.id,files:req.file});
         
    }else{
        //if(req.body.title){
            let updated_at=new Date();
            let updated_by=req.session.re_us_id;
            let media_type="";
            let image="";
            let ContentData="";
            if(req.session.preview_image){
                ContentData=req.session.fordata;
                if(!req.file){
                
                   image=req.session.preview_image
                   media_type="";
                 }
                 else
                 {
                      image= req.file.filename;
                      media_type=req.file.mimetype.split('/','2');
                      console.log(req.file);
                 }
            }else{
                if(!req.file){
                
    
                    image=req.body.old_image;
                    media_type="";
                 }else
                 {
                      image= req.file.filename;
                      media_type=req.file.mimetype.split('/','2');
                      console.log(req.file);
                 }

                 ContentData=req.body;

            }
           

            let painting=await paintingServices.updatePainting(id,ContentData,updated_at,updated_by,image,media_type);
            console.log(painting);
            if(req.session.role=="admin")
            {
                res.redirect('/users/dashboard');
            }
            else
            {
                res.redirect('/users/paintings');
    
            }
        //}
    }
  
   
}
// const updatePainting=async (req,res)=>{
//     let id=req.body.id;
//     //let { id } = req.payload;
//     console.log(id);
//     console.log(req.body);
//     if(req.body.title){
//         let updated_at=new Date();
//         let updated_by=req.session.re_us_id;
//         let media_type="";
//         if(!req.file){
            

//           var image=req.body.old_image;
//           media_type="";
//         }else
//         {
//             var image= req.file.filename;
//              media_type=req.file.mimetype.split('/','2');
//              console.log(req.file);
//         }
//         let painting=await paintingServices.updatePainting(id,req.body,updated_at,updated_by,image,media_type);
//         console.log(painting);
//         if(req.session.role=="admin")
//         {
//             res.redirect('/users/dashboard');
//         }
//         else
//         {
//             res.redirect('/users/paintings');

//         }
//     }
   
// }

const signNft=async(req,res)=>{
    let voucher=req.query.voucher;
    let copy_no=req.query.no_of_copy;
    let content_id=req.query.content_id;
    console.log(copy_no);

    let painting=await paintingServices.getPainting(content_id);
    let imageUrl=base_url+'/uploadFile/'+painting.image;
        
    let tokenUrl=await ipfsSevices.addIPFS({tokenId:painting._id,
        basic_price:painting.basic_price,
        tokenUrl:imageUrl});
      console.log("token url",tokenUrl);
      tokenUrl=imageUrl;  
    for(let i=0;i<copy_no;i++){
        let token_id =Math.floor(Math.random() * 10000);
       
        console.log(token_id);
          let nftObj="";
          if(i>0){
           
            nftObj={content_id:content_id,
                signature:voucher.signature,
                token_id:token_id,
                token_url:tokenUrl,
                min_price:voucher.minPrice,
                }
           
          }else
            {
               

                     nftObj={content_id:content_id,
                        signature:voucher.signature,
                        token_id:voucher.tokenId,
                        token_url:tokenUrl,
                        min_price:voucher.minPrice,
                        }
            }

        try{
            
          let nft=await signNftServices.addVoucher(nftObj);
          console.log(nft);
       }catch(e){console.log(e); }

      
    }
    //res.send(voucher);
    res.send(voucher);

}

module.exports = {
    savePainting,
    upload,
    index,
    deletePainting,
    editPainting,
    updatePainting,
    preview,
    searchContent,
    updateContentStatus,
    uploadFiles,
    rejectContentStatus,
    minftNft,
    signNft,
    globalSearchContent,
    adminGlobalSearchContent
    
};
