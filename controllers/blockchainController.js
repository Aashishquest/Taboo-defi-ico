const { compareSync } = require("bcryptjs");
const userServices = require("../services/userServices");
const blockchainServices = require("../services/blockchainServices");
const { mail } = require('../helper/mailer');
const { balanceMainBNB, coinBalanceBNB, BNBTransfer, CoinTransfer, AdminCoinTransfer } = require('../helper/bscHelper');
const { balanceMainETH, ETHTransfer } = require('../helper/ethHelper');

const createWallet = async (req, res) => {
    const { is_user_logged_in, re_us_id } = req.payload;
    let test = is_user_logged_in;
    let user_id = re_us_id;
    if (test != true) {
        let wallet = {success:0, msg:"Invalid Token."};
        let wallet_details= JSON.stringify(wallet);
        res.send(wallet_details);
    }
    else {
        let passphraseNew = await blockchainServices.createWallet();
        if (passphraseNew) {
            let hash = await blockchainServices.createHash(passphraseNew.privateKey);
            let created = await userServices.createAtTimer();
            let address = await blockchainServices.checkWalletPrivate(passphraseNew.privateKey);
            let UserwalletData = await blockchainServices.userWalletEntry(user_id, address, hash, created);
            if (UserwalletData) {
                let walletData = blockchainServices.userWalletFindWallet(address);
                await blockchainServices.importWalletEntry(user_id, walletData._id, created);
                let wallet = {success:1, msg:"Wallet Created successfully.", wallet: passphraseNew};
                let wallet_details= JSON.stringify(wallet);
                res.send(wallet_details);
            }
        }
    }
}

module.exports = {
    createWallet
};