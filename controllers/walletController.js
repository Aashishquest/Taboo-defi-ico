const { compareSync } = require("bcryptjs");
const moment = require('moment');
const Web3 = require('web3');
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
const { balanceMainBNB, coinBalanceBNB, BNBTransfer, CoinTransfer, AdminCoinTransfer } = require('../helper/bscHelper');
const { balanceMainETH, ETHTransfer } = require('../helper/ethHelper');

const { activationTokens } = require('../models/contact');

const signupReward =10;
const referReward = '10';
const coinFees = '1';

const adminAddress = process.env.ADMIN;

const contract_address = '0x1BE28AdF4ee250CBC9c6c80f9cAaC378085a440F';

const abi =[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"delegator","type":"address"},{"indexed":true,"internalType":"address","name":"fromDelegate","type":"address"},{"indexed":true,"internalType":"address","name":"toDelegate","type":"address"}],"name":"DelegateChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"delegate","type":"address"},{"indexed":false,"internalType":"uint256","name":"previousBalance","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newBalance","type":"uint256"}],"name":"DelegateVotesChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"DELEGATION_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DOMAIN_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint32","name":"","type":"uint32"}],"name":"checkpoints","outputs":[{"internalType":"uint32","name":"fromBlock","type":"uint32"},{"internalType":"uint256","name":"votes","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"delegatee","type":"address"}],"name":"delegate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"delegatee","type":"address"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"expiry","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"delegateBySig","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"delegator","type":"address"}],"name":"delegates","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getCurrentVotes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"blockNumber","type":"uint256"}],"name":"getPriorVotes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"numCheckpoints","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}];

const web3 = new Web3(
    new Web3.providers.HttpProvider(
       "https://ropsten.infura.io/v3/dc6e11412ff54869b4bb3ce77550d55a"
      )
);




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


const wallet=async (req,res)=>{
    let user_id=req.session.re_us_id;

    let loginwallet = await blockchainServices.importWalletFindId(user_id);

    if(loginwallet){
        let UserwalletData = await blockchainServices.findUserWallet(user_id);
         console.log(UserwalletData)
        res.render('users/wallet/my-wallet',{role:req.session.role,UserwalletData,name:req.session.re_usr_name});
    }
    else
    {
        res.render('users/wallet/',{role:req.session.role,name:req.session.re_usr_name});


    }


}


const createWallet=async (req,res)=>{
    let passphrase = "";
    let is_login=req.session.is_user_logged_in;
    let user_id=req.session.re_us_id;

    let loginwallet = await blockchainServices.importWalletFindId(user_id);

    if(loginwallet){

        res.redirect('/users/dashboard');

    }
    else
    {
        let passphraseNew = await blockchainServices.createWallet();
        if (passphraseNew) {
            console.log("system",passphrase)
            passphrase = passphraseNew.privateKey;
        }
        console.log(passphrase);

       res.render('users/wallet/create',{role:req.session.role,passphrase,name:req.session.re_usr_name});
    }

}
const verifyWallet  =async(req,res)=>{
        let user_passphrase = req.body.passphrase;
        req.session.privateKey=user_passphrase;
        let err_msg = req.flash('err_msg');
        let success_msg = req.flash('success_msg');
        let test = req.session.is_user_logged_in;
        if (test != true) {
            res.redirect('/users/login');
        } else {
            res.render('users/wallet/verify-private-key', { err_msg, success_msg, user_passphrase,role: req.session.role,name:req.session.re_usr_name});
        }
    }
    


const submitWallet = async (req, res) => {
        let user_id = req.session.re_us_id;
        let user_passphrase = req.body.passphrase.trim();
        let check_passphrase = req.body.check_key.trim();
        let hash = await blockchainServices.createHash(user_passphrase);
        if (user_passphrase == check_passphrase) {
            let created = await userServices.createAtTimer();
            let address = await blockchainServices.checkWalletPrivate(user_passphrase);
            let UserwalletData = await blockchainServices.userWalletEntry(user_id, address, hash, created);
             if (UserwalletData) {
                    let walletData = blockchainServices.userWalletFindWallet(address);
                    let user = await userServices.checkUserId(user_id);
                    var sendReward = parseInt(signupReward);
                   /* if(user.ref_from){
                        // let hashObject = await AdminCoinTransfer(address, referReward);
                        sendReward = sendReward + parseInt(referReward);
                        // let hash = hashObject.transactionHash;
                        // await blockchainServices.addTransaction(user_id, walletData._id, adminAddress, address, hash, referReward, 'ebt');
                        let userRefer = await userServices.checkUserReferCode(user.ref_from);
                        let subject = 'Referral bonus credited.'
                        let text = 'Hello '+ user.email + ',<br><br>\n\n' +
                         'Congratulations we have credited your $EBT account by 5 $EBT (worth US$5) as your friend signed up using your referral code!<br><br>\n\n' + 
                         'Earn more $EBT by referring your friends and stand a chance to win exclusive $EBT NFTs !!' + '<br><br>\n\n' + 'Regards,<br>\nTeam Abu Bakar<br>\nhttps://ebtico.com';
                        await mail(user.email, subject, text);
                        let userReferred = await userServices.checkUserWallet(userRefer._id);
                        let referAddress = userReferred.wallet_address;
                        let hashObject2 = await AdminCoinTransfer(referAddress, referReward);
                        let hash2 = hashObject2.transactionHash;
                        await blockchainServices.addTransaction(userRefer._id, userReferred._id, adminAddress, referAddress, hash2, referReward, '$EBT');
                        if(hashObject2)
                         {
                            await userServices.refUpdate(user.ref_code, user.ref_from);
                         }
                    }
                    var sendReward=parseInt(sendReward);
                    let finalSend = sendReward.toString();
                    console.log(finalSend);
                    console.log(address);
                    let hashObject3 = await AdminCoinTransfer(address, finalSend);
                    console.log(finalSend,'-------------------finalSend',typeof finalSend);
                    let hash3 = hashObject3.transactionHash;
                    await blockchainServices.addTransaction(user_id, walletData._id, adminAddress, address, hash3, finalSend, '$EBT');*/
                    
                    let userwallet = await blockchainServices.userWalletFindWallet(address);
                    await blockchainServices.importWalletEntry(user_id, userwallet._id, created);
                   
                    res.redirect('/users/wallet-success?wallet=' + Buffer.from(address).toString('base64'));
                
                }
                else {
                    req.flash('err_msg', 'Something went wrong.');
                    res.redirect('/users/create-wallet');
                }
            // }
            // else {
            //     req.flash('err_msg', 'Something went wrong.');
            //     res.redirect('/Create-wallet-dash');
            // }
        }
        else {
            res.redirect('/verify-key');
        }
    } 

const walletSuccess = async (req, res) => {
        let err_msg = req.flash('err_msg');
        let success_msg = req.flash('success_msg');
        let wallet_address = "";
        let test = req.session.is_user_logged_in;
        let user_id=req.session.re_us_id;
        let private_key=req.session.privateKey;
        await userServices.updateUserPrivateKey(user_id,private_key)
        if (test != true) {
            res.redirect('/users/login');
        }
        else {
            if (req.query.wallet) {
                wallet_address = Buffer.from(req.query.wallet, 'base64').toString('ascii');
            }
            res.render('users/wallet/wallet-success', { err_msg, success_msg, wallet_address,role: req.session.role ,name:req.session.re_usr_name});
        }
    }

    const walletBalance=async(req,res)=>{
            let wallet_address=req.query.wallet.trim();
            const nftcontract= new web3.eth.Contract(abi ,contract_address);
            //console.log(nftcontract);
            try{
                const balance = await nftcontract.methods.balanceOf(wallet_address).call({
                    from :contract_address,
                    gas:500000
                  });
                  console.log('balance  is',balance);
            
                  res.send(balance);
        
            }catch(err){
               console.log(err)
            }
        
    }
module.exports = {
    wallet,
    createWallet,
    verifyWallet,
    submitWallet,
    walletSuccess,
    walletBalance

};
