const {SignNftInfo}=require('../models/SignNft');
const { mail } = require('../helper/mailer');
const API_URL = process.env.API_URL;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const Web3 = require('web3');
const web3 = new Web3(
    new Web3.providers.HttpProvider(
       "https://ropsten.infura.io/v3/dc6e11412ff54869b4bb3ce77550d55a"
      )
);
const addVoucher=async(nftData)=>{
      try{

          let nftObj=new SignNftInfo(nftData);
          await nftObj.save();
          return nftObj;
      }catch(e){
          console.log(e);
      }
}

const findByIdVoucher=async(id)=>{
        try{
            let voucher=await SignNftInfo.findOne({content_id:id,status:0});
           return voucher;
        }catch(e){console.log(e)}
}
const findAllVoucher=async(id)=>{
    try{
        let voucher=await SignNftInfo.find();
       return voucher;
    }catch(e){console.log(e)}
}

const updateNftStatus=async(id)=>{
    try{
        let voucher=await SignNftInfo.updateOne({_id:id},{$set:{status:1}});
       return voucher;
    }catch(e){console.log(e)}
}


const SignData=async(voucher)=>{

    try{

        let data= await web3.eth.accounts.sign(voucher,PRIVATE_KEY);
        console.log(data);
        return data;

    }catch(e){console.log(e);}
      
}

module.exports={addVoucher,
               findByIdVoucher,
               SignData,
               updateNftStatus,
               findAllVoucher
              }