const { hashSync } = require("bcryptjs");
const moment = require("moment");
const crypto = require('crypto');
const { generateCode, generateActivationToken } = require('../helper/userHelper');
const { Registration, Userwallet, Importwallet, Tokensettings, Tokendetails, OrderDetails, RefCode, FAQ, ContactInfo, activationTokens } = require('../models/contact');
const {  UserInfo } = require('../models/userModel');
const { OrderInfo } =require('../models/orderModel');
const { MintInfo } =require('../models/mintDetail');

const { mail } = require('../helper/mailer');
const API_URL = process.env.API_URL;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL);

const abi = require("../artifacts/contracts/MyNFT.json");
const contractAddress = "0x023bAdcc83AFDa40Ad602e33EEE993a872589C71";
const nftContract = new web3.eth.Contract(abi, contractAddress);


 const mintNFT=async(address,content_id,copy_for_sale,tokenUrl,title,basic_price) =>{
    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest'); //get latest nonce
    //the transaction
    //console.log(nftContract)
    console.log(copy_for_sale);
    console.log(basic_price);
    let for_sale=BigInt(copy_for_sale);
    let price=BigInt(basic_price);

    var tx="";
    try
     {
       tx = {
        'from': PUBLIC_KEY,
        'to': contractAddress,
        'nonce': nonce,
        'gas': 5000000,
        'maxPriorityFeePerGas': 1999999987,
        'data': nftContract.methods.mintNFT(address,for_sale,tokenUrl,price,title).encodeABI()
      };
       
     }catch(err){
      console.log(err);
    }
   
  
    const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
    signPromise.then((signedTx) => {
  
      web3.eth.sendSignedTransaction(signedTx.rawTransaction, function(err, hash) {
        if (!err) 
         {
          console.log("The hash of your transaction is: ", hash, "\nCheck Alchemy's Mempool to view the status of your transaction!"); 
          // nftContract.methods.get(hash);
           
            
                    mintdetail={content_id:content_id,
                      trx_hash:hash,
                      wallet_address:address,
                      token_id:"",
                      token_url:tokenUrl
                      }
    
                     let mintData=new MintInfo(mintdetail);
                     mintData.save(); 
                  
                 

        } else {
          console.log("Something went wrong when submitting your transaction:", err)
        }
      });
    }).catch((err) => {
      console.log("Promise failed:", err);
    });
  }

  const getTokens=async(tokenUrl)=>{
  
     try{
         let details=await nftContract.methods.uriId(tokenUrl).call({
          from :"0x023bAdcc83AFDa40Ad602e33EEE993a872589C71"
        });
         return details;
      }
      catch(err){
        console.log(err)
      }
    

  }


  const getTokenOwned=async(address)=>{
  
    try{
        let details=await nftContract.methods.tokensOwned(address).call({
         from :"0x023bAdcc83AFDa40Ad602e33EEE993a872589C71"
       });
        return details;
     }
     catch(err){
       console.log(err)
     }
   

 }


  const transferNFT=async(address_from,address_to,tokenId,tokenUrl,private_key)=>{
    
    const nonce = await web3.eth.getTransactionCount(address_from,'latest'); //get latest nonce
    console.log(address_from);
    console.log(address_to);
    console.log(tokenId);
    console.log(tokenUrl);
    console.log("counce",nonce);
     var tx="";
     try
      {
       tx = {
        'from':address_from,
        'to': contractAddress,
        'nonce': nonce,
        'gas': 500000,
        'maxPriorityFeePerGas': 1999999987,
        'data': nftContract.methods.safeTransferFrom(
              address_from,
              address_to,
              tokenId,
              tokenUrl
             ).encodeABI()
      };
       
     }catch(err){
      console.log(err);
    }
   
  
    const signPromise = web3.eth.accounts.signTransaction(tx,private_key);
    signPromise.then((signedTx) => {
  
      web3.eth.sendSignedTransaction(signedTx.rawTransaction, function(err, hash) {
        if (!err) 
         {
          console.log("The hash of your transaction is: ", hash, "\nCheck Alchemy's Mempool to view the status of your transaction!"); 
          // nftContract.methods.get(hash);       

        } else {
          console.log("Something went wrong when submitting your transaction:", err)
        }
      });
    }).catch((err) => {
      console.log("Promise failed:", err);
    });
    

  }




const createCipher = async (text) => {
  let mykey1 = crypto.createCipher('aes-128-cbc', 'mypass');
  let mystr1 = mykey1.update(text, 'utf8', 'hex')
  mystr1 += mykey1.final('hex');
  return mystr1;
};

const createAtTimer = async () => {
  let indiaTime1 = new Date().toLocaleString("en-US", { timeZone: "Europe/London" });
  let indiaTime = new Date(indiaTime1);
  let created_at = indiaTime.toLocaleString();
  return created_at;
};


const findMintDetail=async(content_id)=>{

  try
   {
      let details=await MintInfo.findOne({"content_id":content_id});

       return details;
   }
   catch(err)
    {

   }
}


module.exports = {
    mintNFT,
    getTokens,
    transferNFT,
    findMintDetail,
    getTokenOwned

};
