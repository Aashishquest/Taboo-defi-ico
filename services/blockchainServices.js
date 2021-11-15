const moment = require("moment");
const crypto = require('crypto');
const { hashStatus, createWalletHelper, checkWalletPrivateHelper } = require('../helper/fantomHelper');
const { hashStatusETH } = require('../helper/ethHelper');
const { Registration, Userwallet, Importwallet, Tokensettings, Tokendetails, OrderDetails, RefCode, FAQ, ContactInfo } = require('../models/contact');

const getBalance = async (account) => {
    let balance;
    try {
        balance = await balanceMainBNB(account);
    } catch (error) {
        balance = 0;
    }
    return balance;
};

const getCoinBalance = async (account) => {
    let balance;
    try {
        balance = await coinBalanceBNB(account);
    } catch (error) {
        balance = 0;
    }
    return balance;
};

const createWallet = async () => {
    let newData = await createWalletHelper();
    if(newData){
        return newData;
    }
};

const createHash = async (user_passphrase) => {
    let hash = crypto.createHash('sha256').update(user_passphrase).digest('base64');
    if(hash){
        return hash;
    }
};

const checkWalletPrivate = async (pk) => {
    let newData = await checkWalletPrivateHelper(pk);
    if(newData){
        return newData;
    }
};

const userWalletEntry = async (user_id, address, hash, created) => {
    const UserwalletDataObject = {
        user_id: user_id,
        wallet_address: address,
        passphrase: hash,
        created_at: created,
        status: 'active',
        deleted: '0'
    };
    try {
      const userwallet = new Userwallet(UserwalletDataObject);
      await userwallet.save();
      return UserwalletDataObject;
    } catch (error) {
      console.log("Error", error.message);
    }
};

const userWalletFindWallet = async (address) => {
    let userwallet = await Userwallet.findOne({'wallet_address': address});
    if(userwallet){
        return userwallet;
    }
};

const findUserWallet = async (id) => {
    let userwallet = await Userwallet.findOne({'user_id':id});
    if(userwallet){
        return userwallet;
    }
};

const importWalletEntry = async (user_id, id, created) => {
    const importwalletDataObject = {
        user_id: user_id,
        wallet_id: id,
        login_status: 'login',
        created_at: created,
        status: 'active',
        deleted: '0'
    };
    try {
      const importwallet = new Importwallet(importwalletDataObject);
      await importwallet.save();
      return importwalletDataObject;
    } catch (error) {
      console.log("Error", error.message);
    }
};

const addTransaction = async (user_id, wallet_id, sender_address, reciver_address, hash, get_amount, type) => {
    let respcount = await Tokendetails.count();
    let count_val = parseFloat(respcount) + parseFloat(1);
    let created_at = moment().format('YYYY-MM-DD');
    const TransactionDataObject = {
        auto: count_val,
        user_id: user_id,
        wallet_id: wallet_id,
        sender_wallet_address: sender_address,
        receiver_wallet_address: reciver_address,
        hash: hash,
        amount: get_amount,
        payment_status: 'pending',
        created_at: created_at,
        status: 'active',
        token_type: type,
        transaction_type: 'Send'
    };
    try {
      const transactionData = new Tokendetails(TransactionDataObject);
      await transactionData.save();
      return TransactionDataObject;
    } catch (error) {
      console.log("Error", error.message);
    }
};

const importWalletFindId = async (id) => {
    let importwallet = await Importwallet.findOne({'user_id': id,'login_status':'login'});
    console.log("iddd",id)
    if(importwallet){
        return importwallet;
    }
};

module.exports = {
    getBalance,
    getCoinBalance,
    createWallet,
    createHash,
    checkWalletPrivate,
    userWalletEntry,
    userWalletFindWallet,
    importWalletEntry,
    addTransaction,
    importWalletFindId,
    findUserWallet
};
  