const { compareSync } = require("bcryptjs");
const moment = require('moment');
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
const { balanceMainBNB, coinBalanceBNB } = require('../helper/bscHelper');
const { balanceMainETH } = require('../helper/ethHelper');
const { activationTokens } = require('../models/contact');

const { contentCreaterRegistration, Kyc } = require('../models/contentCreaterModel');
const contentCreaterServices = require("../services/contentCreaterServices");

const login = async (req, res) => {
    //console.log(req.body)
    let user = await contentCreaterServices.checkContentCreater(req.body.email);
    let password = req.body.password.trim();
    let mystr = await contentCreaterServices.createCipher(password);
    if (user) {
        if (user.email_verify_status != true) {
            let wallet = { success: 0, msg: "Account not activated please activate account before login" };
            let wallet_details = JSON.stringify(wallet);
            return res.send(wallet_details);
        }
        userObject = {
            name: user.name,
            email: user.email,
            created_at: user.created_at,
            email_verify_status: user.email_verify_status,
            mobile_no: user.mobile_no,
            address: user.address,
            user_address: user.user_address,
            country: user.country,
            state: user.state,
            city: user.city,
            status: user.status,
            type: user.type,
        }
        let userLogin = await contentCreaterServices.checkContentCreaterPass(req.body.email.trim(), mystr);
        if (userLogin) {
            const _token = jwt.sign({
                success: true,
                re_us_id: userLogin._id,
                re_usr_name: userLogin.name,
                re_usr_email: userLogin.email,
                is_user_logged_in: true
            }, JWT_SECRET_KEY, { expiresIn: '1h' });
            let wallet = { success: 1, msg: "Login successful.", token: _token, user: userObject };
            let wallet_details = JSON.stringify(wallet);
            res.send(wallet_details);
        }
        else {
            let wallet = { success: 0, msg: "Incorrect credentials." };
            let wallet_details = JSON.stringify(wallet);
            res.send(wallet_details);
        }
    }
    else {
        let wallet = { success: 0, msg: "Email address does not exist." };
        let wallet_details = JSON.stringify(wallet);
        res.send(wallet_details);
    }
}

const Storage = multer.diskStorage({
    destination: './public/uploadFileContent',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})

//middleware
const upload = multer({
    storage: Storage
}).array('file',2);


const signup= async (req,res)=> {
    res.render('users/register', { layout: 'layouts/front/layout' });

}
const submitSignup = async (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    let mobile = req.body.mobile;
    let username = req.body.username;
    
      console.log(req.body);
        if(name && email && password && username && mobile){
            let user = await userServices.checkUser(req.body.email);
            console.log(user);
            if (user) 
             {
                req.flash('err_msg', 'Email already exists. Please enter another email.');
                res.redirect('/users/signup');
            }
            else {
                let mystr = await contentCreaterServices.createCipher(req.body.password);
                let created = await contentCreaterServices.createAtTimer();
                let newuser = await userServices.addUser(req.body, mystr, created);
                let user = await userServices.checkUser(req.body.email);
                //let activationmail = await userServices.sendActivationMail(user, req)
                console.log(user);
                req.flash('success_msg', 'Content Creater registered. Please verify to continue.');
              res.redirect('/users/login');
            }
        
        }
   
}

const activateAccount = async (req, res) => {
    let email = req.body.email;
    let user = await contentCreaterServices.checkContentCreater(email)
    if (user) {
        let mail = await contentCreaterServices.sendActivationMail(user, req)
        let wallet = { success: 1, msg: "We have sent an activation mail to your registered mail." };
        let wallet_details = JSON.stringify(wallet);
        res.send(wallet_details);
    }
    else {
        let wallet = { success: 0, msg: "Email address does not exist." };
        let wallet_details = JSON.stringify(wallet);
        res.send(wallet_details);
    }
}

const activateContentCreater = async function (req, res) {
    const tokenId = req.params.id
    console.log(tokenId)
    let token = await activationTokens.findOne({ '_id': tokenId });
    if (token) {
        let activate = await contentCreaterServices.updatecontentCreaterStatus(token._userId)
        if (activate) {
            let wallet = { success: 1, msg: "Account activted successfully" };
            let wallet_details = JSON.stringify(wallet);
            res.send(wallet_details);
        }
        else {
            let wallet = { success: 0, msg: "Something went wrong please try later" };
            let wallet_details = JSON.stringify(wallet);
            res.send(wallet_details);
        }
    }
    else {
        let wallet = { success: 0, msg: "Activation link deactivated or invalid Please resend detials to get activation mail." };
        let wallet_details = JSON.stringify(wallet);
        res.send(wallet_details);
    }
}

const forgetPassword = async (req, res) => {
    let user = await contentCreaterServices.checkContentCreater(req.body.email);
    if (!user) {
        let wallet = { success: 0, msg: "Email address does not exist." };
        let wallet_details = JSON.stringify(wallet);
        res.send(wallet_details);
    }
    else {
        let new_pass = Math.random().toString(36).slice(-6);
        console.log(new_pass, '----------new_pass');
        let mystr1 = await contentCreaterServices.createCipher(new_pass);
        let userUpdated = await contentCreaterServices.updateContentCreaterPassword(req.body.email, mystr1);
        if (userUpdated) {
            let passwordmail = await contentCreaterServices.sendNewPasswordMail(req, new_pass, userUpdated._id)
            let wallet = { success: 1, msg: "Password mail sent to registered email" };
            let wallet_details = JSON.stringify(wallet);
            res.send(wallet_details);
        }
        else {
            let wallet = { success: 0, msg: "An error occured." };
            let wallet_details = JSON.stringify(wallet);
            res.send(wallet_details);
        }
    }
}

const submitChange = async (req, res) => {
    const { re_us_id } = req.payload;
    const user_id = re_us_id;
    const old_pass = req.body.password;
    const new_pass = req.body.new_password;
    console.log('in submit change password', req.body)
    let user = await contentCreaterServices.checkContentCreaterId(user_id);
    if (!user) {
        let wallet = { success: 0, msg: "Email address does not exist." };
        let wallet_details = JSON.stringify(wallet);
        res.send(wallet_details);
    }
    else {
        let mystr = await contentCreaterServices.createCipher(old_pass);
        let user = await contentCreaterServices.checkContentCreaterPassID(re_us_id, mystr);
        if (user) {
            if (new_pass) {
                let mystr2 = await contentCreaterServices.createCipher(new_pass);
                if (mystr != mystr2) {
                    //console.log('userUpdated mystr2...', mystr2)
                    let userUpdated = await contentCreaterServices.updateContentCreaterPasswordID(user_id, mystr2);
                    //console.log('userUpdated...', userUpdated)
                    if (userUpdated) {
                        let wallet = { success: 1, msg: "Password updated successfully.", password: new_pass };
                        let wallet_details = JSON.stringify(wallet);
                        res.send(wallet_details);
                    }
                    else {
                        let wallet = { success: 0, msg: "An error occured." };
                        let wallet_details = JSON.stringify(wallet);
                        res.send(wallet_details);
                    }
                }
                else {
                    let wallet = { success: 0, msg: "New password cannot be same as previous password." };
                    let wallet_details = JSON.stringify(wallet);
                    res.send(wallet_details);
                }
            }
        }
        else {
            let wallet = { success: 0, msg: "Incorrect Password." };
            let wallet_details = JSON.stringify(wallet);
            res.send(wallet_details);
        }
    }
}

const updateContentCreaterProfile = async (req, res) => {
    const { is_user_logged_in, re_us_id } = req.payload;
    if (is_user_logged_in) {
        let updated_at = await contentCreaterServices.createAtTimer();
        let updateUser = await contentCreaterServices.updateContentCreaterProfile(req.body, updated_at, re_us_id)
        if (updateUser) {
            console.log('updateUser...', updateUser)
            let wallet = { success: 1, msg: "Profile updated successfully.", contentCreater: updateUser };
            let wallet_details = JSON.stringify(wallet);
            res.send(wallet_details);
        }
        else {
            let wallet = { success: 0, msg: "Something went wrong." };
            let wallet_details = JSON.stringify(wallet);
            res.send(wallet_details);
        }
    }
    else {
        let wallet = { success: 0, msg: "Invalid Token." };
        let wallet_details = JSON.stringify(wallet);
        res.send(wallet_details);
    }
}

const kycPost = async (req, res) => {
    const { re_us_id, re_usr_email } = req.payload;
    let user = await contentCreaterServices.checkContentCreater(re_usr_email)
    if (user) {
        if (user.kycStatus == 'approved') {
            let wallet = { success: 1, msg: "Kyc  already approved no need to resubmit.", contentCreater: updateUser };
            let wallet_details = JSON.stringify(wallet);
            res.send(wallet_details);
        }
        else {
            const form = formidable({ multiples: true });
            form.parse(req, async (err, fields, files) => {
                let Userkyc = await contentCreaterServices.addKyc(req, res, fields, files)
            })
        }
    }
    else {
        let wallet = { success: 0, msg: "Email address does not exist." };
        let wallet_details = JSON.stringify(wallet);
        res.send(wallet_details);
    }
}


module.exports = {
    login,
    upload,
    activateAccount,
    activateContentCreater,
    forgetPassword,
    submitChange,
    updateContentCreaterProfile,
    kycPost,
    signup,
    submitSignup
}