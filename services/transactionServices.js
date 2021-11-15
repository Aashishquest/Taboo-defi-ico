const { Transaction } = require('ethereumjs-tx');
const {TransactionInfo}=require('../models/Transaction')
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const Web3 = require('web3');
const axios = require('axios');
const web3 = new Web3(
    new Web3.providers.HttpProvider(
       "https://ropsten.infura.io/v3/dc6e11412ff54869b4bb3ce77550d55a"
      )
);

const contractAddress = '0x1BE28AdF4ee250CBC9c6c80f9cAaC378085a440F';

const abi =[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"delegator","type":"address"},{"indexed":true,"internalType":"address","name":"fromDelegate","type":"address"},{"indexed":true,"internalType":"address","name":"toDelegate","type":"address"}],"name":"DelegateChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"delegate","type":"address"},{"indexed":false,"internalType":"uint256","name":"previousBalance","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newBalance","type":"uint256"}],"name":"DelegateVotesChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"DELEGATION_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DOMAIN_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint32","name":"","type":"uint32"}],"name":"checkpoints","outputs":[{"internalType":"uint32","name":"fromBlock","type":"uint32"},{"internalType":"uint256","name":"votes","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"delegatee","type":"address"}],"name":"delegate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"delegatee","type":"address"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"expiry","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"delegateBySig","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"delegator","type":"address"}],"name":"delegates","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getCurrentVotes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"blockNumber","type":"uint256"}],"name":"getPriorVotes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"numCheckpoints","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}];
const nftContract = new web3.eth.Contract(abi, contractAddress);

const transferTaboo=async(address_to,taboo)=>{


    let nonce = await web3.eth.getTransactionCount(PUBLIC_KEY,'latest'); //get latest nonce
    console.log(PUBLIC_KEY);
    console.log(address_to);
    console.log("taboo",taboo);
    nonce=nonce+1;
    let amount= '0x' + ((taboo*1000000000000000000).toString(16))

     var tx="";
     try
      {
       tx = {
        'from':PUBLIC_KEY,
        'to': contractAddress,
        'nonce': nonce,
        'gas': 5000000,
        'maxPriorityFeePerGas': 1999999987,
        'data': nftContract.methods.transfer(
              address_to,
              amount,
             ).encodeABI()
      };
       
     }catch(err){
      console.log(err);
    }

    const signPromise = web3.eth.accounts.signTransaction(tx,PRIVATE_KEY);

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
const add=async(txData)=>{
    try{

        let tx= new TransactionInfo(txData);
         await tx.save();
         return tx;
    }catch(e){console.log(e);
    }
}


const getTabooBalance=async(address)=>{
  
  try{
      let balance=await nftContract.methods.balanceOf(address).call({
                    from :contractAddress
                    });
      return balance;
   }
   catch(err){
     console.log(err)
   }
 

}


const findAll=async()=>{
    try{
        return await TransactionInfo.find({});
    }catch(e){console.log(e);}
}

const findByUserId=async(id)=>{

    try{
        let tx= await TransactionInfo.find({user_id:id});

        let earning=0;
        tx.forEach(element => {
            if(!isNaN(element.amount)){
                earning=earning+parseInt(element.amount);
            }
        });
      return earning;
    }catch(e){console.log(e);}
}

const findById=async(user_id)=>{
    try{
        return await TransactionInfo.find({user_id:user_id});
    }catch(e){console.log(e);}
}
const tabooRate=async(taboo)=>{
 
    let response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=taboo-token&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true');
  //console.log('response',response)
    if (response) { // if HTTP-status is 200-299
  // get the response body (the method explained below)
  //let data = await response.data();

console.log('data',response.data['taboo-token'].usd)

var totalUsd=  response.data['taboo-token'].usd*taboo
  return totalUsd
}

   

}
module.exports={add,findAll,findById,findByUserId,transferTaboo,getTabooBalance,tabooRate}