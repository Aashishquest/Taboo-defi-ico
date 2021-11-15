const moment = require('moment');
const crypto = require('crypto');
const { Registration } = require('../models/contact');
const userServices = require('../services/userServices');
const blockChainServices = require('../services/blockchainServices')
const { AdminInfo } = require("../models/admin");
const { contentCreaterRegistration, Kyc } = require('../models/contentCreaterModel');


const findAdmin = async (email) => {
    let user = await AdminInfo.findOne({ 'email': email });
    if (user) {
        return user;
    }
    else {
        return 'notAdmin'
    }
};

const checkAdminPass = async (email, password) => {
    let user = await AdminInfo.findOne({ 'email': email, 'password': password });
    if (user) {
        return user;
    }
    else {
        return 'wrongPassword'
    }
};

const userCount = async () => {
    totalUsers = await Registration.count()
    if (totalUsers) {
        return totalUsers
    }
    else {
        return 0
    }
}

const createCipher = async (text) => {
    let mykey1 = crypto.createCipher('aes-128-cbc', 'mypass');
    let mystr1 = mykey1.update(text, 'utf8', 'hex')
    mystr1 += mykey1.final('hex');
    return mystr1;
};

const checkAdminId = async (user_id) => {
    let user = await AdminInfo.findOne({ '_id': user_id });
    if (user) {
        return user;
    }
};

const checkUserPass = async (email, password) => {
    let user = await AdminInfo.findOne({ 'email': email, 'password': password });
    if (user) {
      return user;
    }
};

const createSession = async (req, admin) => {
    req.session.user_main_id = admin._id;
    req.session.user_name = admin.name;
    req.session.profile_image = admin.profile_image;
    req.session.re_usr_email = admin.email;
    req.session.user_type = admin.user_type;
    req.session.is_admin_loggedin = true;
    /*******Call save function to store****/

    req.session.save(function (err, res) {
        console.log('saved?!');
        //console.log(`Error`, err)
        //console.log(`Session`, res)
        return req.session
    });
};

const activateUser = async (req, res) => {
    var user_id = req.query.id.trim();
    console.log("activateUser-54", user_id)
    Registration.updateOne({ 'email': user_id }, { $set: { 'status': 'active' } }, { upsert: true }, function (err, result) {
        if (err) { console.log(err); }
        else {
            req.flash('success_msg', 'User has been activated successfully.');
            res.redirect('/user-list');
        }
    })
}

const deactivateUser = async (req, res) => {
    var user_id = req.query.id.trim();
    console.log("deactivateUser-65", user_id)
    Registration.updateOne({ 'email': user_id }, { $set: { 'status': 'inactive' } }, { upsert: true }, function (err, result) {
        if (err) { console.log(err); }
        else {
            req.flash('success_msg', 'User has been deactivated successfully.');
            res.redirect('/user-list');
        }
    })
}

const usersRegisteredThisMonth = async () => {
    let result = 0
    var month = moment(new Date()).format('M');
    var year = moment(new Date()).format('YYYY');
    console.log(month, year)
    var min = moment(new Date(`${month}/1/${year}`)).format('M/D/YYYY');
    var max = moment(new Date()).format('M/D/YYYY');
    console.log(min, max);
    await Registration.count({ deleted: '0', created_at: { $gte: min + ', 00:00:00 AM', $lte: max + ', 12:59:59 PM' } }).sort({ _id: -1 }).lean().then(async (results) => {
        if (results > 0) {
            console.log("usersRegisteredThisMonth", results)
            result = results
        }
    })
    return result
}

const findUsersData = async () => {
    let users = await Registration.find();
    let n = users.length;
    let userdata = [];
    if (users) {
        for (let i = 0; i < n; i++) {
            //console.log(i);
            let appendData = {};
            appendData.user = users[i]
            // console.log('user_id', users[i]._id)
            // let loginwallet = await blockChainServices.importWalletFindId(users[i]._id);
            // console.log('loginwallet', loginwallet)
            // if (loginwallet) {
            //let wallet = await blockChainServices.userWalletFindId(loginwallet.wallet_id);
            appendData.wallet = users[i].wallet_address;
            //console.log('appendData.user.wallet', appendData.wallet);
            let walletbalance = await blockChainServices.getCoinBalance(appendData.wallet)
            appendData.walletbalance = walletbalance
            //console.log('appendData.walletbalance', appendData.walletbalance);

            userdata.push(appendData);
        }
    }
    return userdata;
}

const getUsers = async () => {
    let users = await Registration.find({});
    if (users) {
        return users;
    }
};

const getContentUsers = async () => {
    let users = await contentCreaterRegistration.find({});
    if (users) {
        return users;
    }
};

const pendingKYCusers = async () => {
    let users = await Kyc.find({ status: 'pending' });
    if (users) {
        return users;
    }
};

const completedKYCusers = async () => {
    let users = await Kyc.find({ status: 'approved' });
    if (users) {
        return users;
    }
};

const updateKYCuser = async (email) => {
    try {
        let user = await Kyc.findOne({ 'email': email });
        if (user) {
          await Kyc.update({ 'email': email }, { $set: { status: 'approved' } });
        }
        let userUpdated = await Kyc.findOne({ 'email': email });
        return userUpdated;
    } catch (error) {
        return null;
    }
};

// const kycData = async () => {
//     let kycData = await Kyc.find({});
//     //console.log(kycData);
//     return kycData
// }

// const kycDataById = async (res, id) => {
//     let kycData = await Kyc.findOne({ _id: id });
//     if (kycData) {
//         return kycData;
//     }
//     else {
//         res.send('Something went wrong')
//     }
// }

// const kycApprove = async (id) => {
//     let kycData = await Kyc.findOne({ _id: id });
//     if (kycData) {
//         kycData.status = 'approved';
//         await kycData.save();
//         let user = await Registration.findOne({ _id: kycData.user_id });
//         user.KycStatus = 'approved';
//         await user.save();
//         return kycData;
//     }
//     else {
//         return false
//     }
// }

// const kycReject = async (id) => {
//     let kycData = await Kyc.findOne({ _id: id });
//     if (kycData) {
//         kycData.status = 'rejected';
//         await kycData.save();
//         //console.log('kycData.user_id', kycData.user_id)
//         let user = await Registration.findOne({ _id: kycData.user_id });
//         //console.log('user', user)
//         user.KycStatus = 'rejected';
//         await user.save();
//         return kycData;
//     }
//     else {
//         return false
//     }
// }


module.exports = {
    checkAdminPass,
    findAdmin,
    createCipher,
    checkAdminId,
    checkUserPass,
    createSession,
    activateUser,
    deactivateUser,
    usersRegisteredThisMonth,
    findUsersData,
    userCount,
    usersRegisteredThisMonth,
    getUsers,
    getContentUsers,
    pendingKYCusers,
    completedKYCusers
}