const { compareSync } = require("bcryptjs");
const moment = require('moment');
const request = require('request');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const adminServices = require("../services/adminServices");
const token = require('../helper/token');
const { JWT_SECRET_KEY } = require('../config/default.json');
const { mail } = require('../helper/mailer');

const userLogin = async (req, res) => {
    //console.log(req.body)
    let user = await adminServices.findAdmin(req.body.email);
    let password = req.body.password.trim();
    let mystr = await adminServices.createCipher(password);
    if (user) {
        let userLogin = await adminServices.checkUserPass(req.body.email.trim(), mystr);
        if (userLogin) {
            const _token = jwt.sign({
                success: true,
                re_admin_id: userLogin._id,
                re_admin_name: userLogin.name,
                re_admin_email: userLogin.email,
                is_admin_logged_in: true
            }, JWT_SECRET_KEY, { expiresIn: '1h' });
            let wallet = { success: 1, msg: "Login successful.", token: _token };
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

const userList = async (req, res) => {
    let { is_admin_logged_in } = req.payload;
    if(is_admin_logged_in){
        let users = await adminServices.getUsers();
        let wallet = { success: 1, msg: "Users list.", users };
        let wallet_details = JSON.stringify(wallet);
        res.send(wallet_details);
    }
    else {
        let wallet = { success: 0, msg: "Admin not logged in." };
        let wallet_details = JSON.stringify(wallet);
        res.send(wallet_details);
    }
}

const contentList = async (req, res) => {
    let { is_admin_logged_in } = req.payload;
    if(is_admin_logged_in){
        let users = await adminServices.getContentUsers();
        let wallet = { success: 1, msg: "Content creators list.", users };
        let wallet_details = JSON.stringify(wallet);
        res.send(wallet_details);
    }
    else {
        let wallet = { success: 0, msg: "Admin not logged in." };
        let wallet_details = JSON.stringify(wallet);
        res.send(wallet_details);
    }
}

const pendingKYC = async (req, res) => {
    let { is_admin_logged_in } = req.payload;
    if(is_admin_logged_in){
        let users = await adminServices.pendingKYCusers();
        let wallet = { success: 1, msg: "Pending KYC users list.", users };
        let wallet_details = JSON.stringify(wallet);
        res.send(wallet_details);
    }
    else {
        let wallet = { success: 0, msg: "Admin not logged in." };
        let wallet_details = JSON.stringify(wallet);
        res.send(wallet_details);
    }
}

const completedKYC = async (req, res) => {
    let { is_admin_logged_in } = req.payload;
    if(is_admin_logged_in){
        let users = await adminServices.completedKYCusers();
        let wallet = { success: 1, msg: "Completed KYC users list.", users };
        let wallet_details = JSON.stringify(wallet);
        res.send(wallet_details);
    }
    else {
        let wallet = { success: 0, msg: "Admin not logged in." };
        let wallet_details = JSON.stringify(wallet);
        res.send(wallet_details);
    }
}

const updateKYC = async (req, res) => {
    let { is_admin_logged_in } = req.payload;
    if(is_admin_logged_in){
        let users = await adminServices.updateKYCuser(email);
        let wallet = { success: 1, msg: "Completed KYC users list.", users };
        let wallet_details = JSON.stringify(wallet);
        res.send(wallet_details);
    }
    else {
        let wallet = { success: 0, msg: "Admin not logged in." };
        let wallet_details = JSON.stringify(wallet);
        res.send(wallet_details);
    }
}

module.exports = {
    userLogin,
    userList,
    contentList,
    pendingKYC,
    completedKYC
};
