const web3 = require('web3');
const Tx = require('ethereumjs-tx').Transaction;
const Common = require('ethereumjs-common');

const { Tokensettings } = require('../models/contact');

const web3js = new web3(
    new web3.providers.HttpProvider(
        "https://rpcapi-tracing.testnet.fantom.network"
    )
);

// const admin = process.env.ADMIN;
// const keyAdmin = process.env.PPK;

// const coinABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"_decimals","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burnFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"isOwner","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}];

// const coinAddress = "0x54d2E38EBa7B004fb25B81A6b875107bbF1FADa0";

const JUSTransfer = async (receiver_address, amount, sender_address, sender_private_key) => {
    if (sender_private_key.length > 64) {
        let num = sender_private_key.length - 64;
        sender_private_key = sender_private_key.slice(num);
    }
    const privateKey = Buffer.from(sender_private_key, 'hex');
    let estimates_gas = await web3js.eth.estimateGas({
        from: sender_address,
        to: receiver_address,
        amount: web3js.utils.toWei(amount, "ether"),
    });
    let gasLimit = web3js.utils.toHex(estimates_gas * 2);
    let gasPrice_bal = await web3js.eth.getGasPrice();
    let gasPrice = web3js.utils.toHex(gasPrice_bal * 2);
    let v = await web3js.eth.getTransactionCount(sender_address);
    let rawTransaction = {
        "gasPrice": gasPrice,
        "gasLimit": gasLimit,
        "to": receiver_address,
        "value": web3js.utils.toHex(web3js.utils.toWei(amount, "ether")),
        "nonce": web3js.utils.toHex(v)
    }
    const common = Common.default.forCustomChain('mainnet', {
        name: 'bnb',
        networkId: 97,
        chainId: 97
    }, 'petersburg');
    let transaction = new Tx(rawTransaction, { common });
    transaction.sign(privateKey);
    let hash = web3js.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'));
    return hash;
}

// const CoinTransfer =  async (receiver_address, amount, sender_address, sender_private_key) => {
//     if(sender_private_key.length > 64){
//         let num = sender_private_key.length - 64;
//         sender_private_key = sender_private_key.slice(num);
//     }
//     const privateKey = Buffer.from(sender_private_key, 'hex');
//     let tokenContract = new web3js.eth.Contract(coinABI, coinAddress);
//     let estimates_gas = await web3js.eth.estimateGas({
//         from: sender_address,
//         to: receiver_address,
//         amount: web3js.utils.toWei(amount, "ether"),
//     });
//     let gasLimit = web3js.utils.toHex(estimates_gas * 3);
//     let gasPrice_bal = await web3js.eth.getGasPrice();
//     let gasPrice = web3js.utils.toHex(gasPrice_bal * 2);
//     let count = await web3js.eth.getTransactionCount(sender_address);
//     let sendAmount = amount * Math.pow(10, 18);
//     sendAmount = sendAmount.toString();
//     let rawTransaction = {
//         "gasPrice": gasPrice,
//         "gasLimit": gasLimit,
//         "to": coinAddress,
//         "data": tokenContract.methods.transfer(receiver_address, sendAmount).encodeABI(),
//         "nonce": web3js.utils.toHex(count)
//     };
//     const common = Common.default.forCustomChain('mainnet', {
//         name: 'bnb',
//         networkId: 97,
//         chainId: 97
//     }, 'petersburg');
//     let transaction = new Tx(rawTransaction, { common });
//     transaction.sign(privateKey);
//     let hash = web3js.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'));
//     return hash;
// }

// const AdminCoinTransfer =  async (receiver_address, amount) => {
//     let sender_address = admin;
//     let sender_private_key = keyAdmin;
//     const privateKey = Buffer.from(sender_private_key, 'hex');
//     let tokenContract = new web3js.eth.Contract(coinABI, coinAddress);
//     let estimates_gas = await web3js.eth.estimateGas({
//         from: sender_address,
//         to: receiver_address,
//         amount: web3js.utils.toWei(amount, "ether"),
//     });
//     let gasLimit = web3js.utils.toHex(estimates_gas * 3);
//     let gasPrice_bal = await web3js.eth.getGasPrice();
//     let gasPrice = web3js.utils.toHex(gasPrice_bal * 2);
//     let count = await web3js.eth.getTransactionCount(sender_address);
//     let sendAmount = amount * Math.pow(10, 18);
//     sendAmount = sendAmount.toString();
//     let rawTransaction = {
//         "gasPrice": gasPrice,
//         "gasLimit": gasLimit,
//         "to": coinAddress,
//         "data": tokenContract.methods.transfer(receiver_address, sendAmount).encodeABI(),
//         "nonce": web3js.utils.toHex(count)
//     };
//     const common = Common.default.forCustomChain('mainnet', {
//         name: 'bnb',
//         networkId: 97,
//         chainId: 97
//     }, 'petersburg');
//     let transaction = new Tx(rawTransaction, { common });
//     transaction.sign(privateKey);
//     let hash = web3js.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'))
//     return hash;
// }

const hashStatus = async (hash) => {
    let status = await web3js.eth.getTransactionReceipt(hash);
    if (status) {
        return status.blockNumber;
    }
}

const balanceMainJUS = async (account) => {
    let balance = await web3js.eth.getBalance(account);
    if (balance) {
        balance = balance / Math.pow(10, 18);
        return balance;
    }
};

// const coinBalanceBNB = async (account) => {
//     let tokenContract = new web3js.eth.Contract(coinABI, coinAddress);
//     let balance;
//     try {
//         balance = await tokenContract.methods.balanceOf(account).call();
//         balance = parseFloat(balance) / Math.pow(10,18);
//     } catch (error) {
//         balance = 0;
//     }
//     return balance;
// };

const createWalletHelper = async () => {
    let newData = await web3js.eth.accounts.create();
    if (newData) {
        return newData;
    }
};

const checkWalletPrivateHelper = async (pk) => {
    let newData = await web3js.eth.accounts.privateKeyToAccount(pk);
    if (newData) {
        return newData.address;
    }
};


const addtokensettings = async function () {
    let rates = {
        token_name: 'SFL',
        total_quantity: '10000',
        etherValue: '1',
        btcValue: '1',
        token_name: '1',
        total_quantity: '1',
        etherValue: '1',
        btcValue: '1',
        usdValue: '1',
        xrpValue: '1',
        ltcValue: '1',
        dashValue: '1',
        bnbValue: '1',
        updated_at: '1',
    }
    let token = new Tokensettings(rates)
    await token.save();
    console.log(token)
}
//addtokensettings();

module.exports = {
    JUSTransfer,
    // CoinTransfer,
    // AdminCoinTransfer,
    hashStatus,
    balanceMainJUS,
    // coinBalanceBNB,
    createWalletHelper,
    checkWalletPrivateHelper
}