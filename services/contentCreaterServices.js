const { hashSync } = require("bcryptjs");
const moment = require("moment");
const crypto = require('crypto');
const { generateCode, generateActivationToken } = require('../helper/userHelper');
const { Registration, activationTokens } = require('../models/contact');
const { mail } = require('../helper/mailer');
const { contentCreaterRegistration, Kyc } = require('../models/contentCreaterModel')

const addcontentCreater = async (userDetails, pass, created, fileName, date) => {
    const userObject = {
        name: userDetails.name,
        first_name: '',
        last_name: '',
        email: userDetails.email,
        password: pass,
        created_at: created,
        email_verify_status: false,
        mobile_no: userDetails.phone,
        username: userDetails.username,
        address: '',
        user_address: '',
        country: userDetails.country,
        state: '',
        city: '',
        status: 'active',
        // profile_image: fileName[0].filename,
        genre: userDetails.genre,
        bio: userDetails.bio,
        current: userDetails.current,
        birthday: new Date(date),
        id1: fileName[0].filename,
        id2: fileName[1].filename,
    };
    try {
        const contentCreater = new contentCreaterRegistration(userObject);
        await contentCreater.save();
        return userObject;
    } catch (error) {
        console.log(error)
        return null;
    }
};

const checkContentCreaterId = async (user_id) => {
    let user = await contentCreaterRegistration.findOne({ '_id': user_id });
    if (user) {
        return user;
    }
};

const checkContentCreater = async (email) => {
    let user = await contentCreaterRegistration.findOne({ 'email': email });
    if (user) {
        return user;
    }
};

const checkContentCreaterPass = async (email, password) => {
    let user = await contentCreaterRegistration.findOne({ 'email': email, 'password': password });
    if (user) {
        return user;
    }
};

const checkContentCreaterPassID = async (id, password) => {
    let user = await contentCreaterRegistration.findOne({ '_id': id, 'password': password });
    if (user) {
        return user;
    }
};

const createCipher = async (text) => {
    let mykey1 = crypto.createCipher('aes-128-cbc', 'mypass');
    console.log('mykey1...', mykey1, text)
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

const sendActivationMail = async function (newContentCreater, req) {
    let activationTokenId = await generateActivationToken(newContentCreater)
    console.log(`26 contentCreaterServices TokenId`, activationTokenId)
    const subject = 'JUSTyours Account Activation'
    const reciever = `${newContentCreater.email}`
    const message = `
    <h3> Hello ${newContentCreater.name}, </h3>
    <p>Thank you for registering on JUSTyours as content creater.</p>
    <p>To activate your account please follow this link:</p>
    <p> <a target="_" href="http://${req.headers.host}/activate/contentCreater/${activationTokenId}" </a>Click Here</p>
    <p>This link will get deactivated in 30 min</p>
    <p>Team JUSTyours</p>`;

    let sendmail = await mail(reciever, subject, message);
    console.log('In send activation mail...', sendmail)
    if (sendmail) {
        return true;
    }
}

const updatecontentCreaterStatus = async function (user_id) {
    try {
        let user = await contentCreaterRegistration.findOne({ '_id': user_id });
        if (user) {
            await contentCreaterRegistration.update({ '_id': user_id }, { $set: { email_verify_status: true } });
            return true;
        }
        else {
            return false;
        }
    } catch (err) {
        console.log(err)
        return false
    }
}

const sendNewPasswordMail = async function (req, otp, user_id) {
    console.log(otp)
    let user = await contentCreaterRegistration.findOne({ '_id': user_id });

    console.log(`ForgetPassword OTP generated for ${user.name}`);
    const subject = 'JUSTyours Forget Password'
    const reciever = `${user.email}`
    const message = `
        <h3> Hello ${user.name}, </h3>
        <p>Thank you for using JUSTyours.</p>
        <p>Here is your password please don't share this with anybody</p>
        <p> <h2>${otp}</h2></p>
        <p>You can change password once you login</p>
        <p>Team JUSTyours</p>`;
    let sendmail = await mail(reciever, subject, message);
    if (sendmail) {
        return true;
    }

}

const updateContentCreaterPassword = async (email, password) => {
    try {
        let user = await contentCreaterRegistration.findOne({ 'email': email });
        if (user) {
            await contentCreaterRegistration.update({ 'email': email }, { $set: { password: password } });
        }
        let userUpdated = await contentCreaterRegistration.findOne({ 'email': email });
        return userUpdated;
    } catch (error) {
        return null;
    }
};

const updateContentCreaterPasswordID = async (id, password) => {
    try {
        let user = await contentCreaterRegistration.findOne({ '_id': id });
        if (user) {
            await contentCreaterRegistration.update({ '_id': id }, { $set: { password: password } });
        }
        let userUpdated = await contentCreaterRegistration.findOne({ '_id': id });
        return userUpdated;
    } catch (error) {
        return null;
    }
};

const updateContentCreaterProfile = async (userDetails, updated_at, re_us_id) => {
    let user = await checkContentCreaterId(re_us_id);
    if (user) {
        user.name = userDetails.name;
        user.mobile_no = userDetails.phone;
        user.country = userDetails.country;
        user.address = userDetails.address;
        user.state = userDetails.state;
        user.city = userDetails.city;
        user.dob = userDetails.dob
        user.updated_at = updated_at
        try {
            await user.save();
            return user;
        }
        catch (error) {
            return null;
        }
    }
}

const addKyc = async (req, res, fields, files) => {

    const { re_us_id, re_usr_email } = req.payload;
    let frontImage = '';
    let backImage = '';
    if (fields.name == '' && fields.country == '' && fields.dob == '' && fields.Idtype == '' && fields.IdNumber == '') {
        let wallet = { success: 0, msg: "Please submit the neccessary fields [name,country,dob,Idtype,IdNumber]" };
        let wallet_details = JSON.stringify(wallet);
        return res.send(wallet_details);
    }
    const frontImage1 = typeof files.frontImage !== "undefined" ? files.frontImage.name : "";
    if (frontImage1 != "") {
        console.log('frontImage......', frontImage1)
        frontImage = await fs.readFileSync(files.frontImage.path);
        //Buffer(testFile);
    }
    else {
        let wallet = { success: 0, msg: "Please submit submit 'frontImage'  of Id" };
        let wallet_details = JSON.stringify(wallet);
        return res.send(wallet_details);
    }
    const backImage1 = typeof files.backImage !== "undefined" ? files.backImage.name : "";
    if (backImage1 != "") {
        backImage = await fs.readFileSync(files.backImage.path);
        //Buffer(testFile);
    }
    else {
        // req.flash('err_msg', 'plback Image of Id document');
        // return res.redirect('/kyc')
    }
    // const { re_us_id, re_usr_email } = req.payload;
    let kycobject = {
        user_id: re_us_id,
        email: re_usr_email,
        name: fields.name,
        dob: fields.dob,
        country: fields.country,
        documenttype: fields.Idtype,
        documentnumber: fields.IdNumber,
        frontImageName: files.frontImage.name,
        backImageName: files.backImage.name,
        frontImage: {
            data: frontImage,
            contentType: 'image/png'
        },
        backImage: {
            data: backImage,
            contentType: 'image/png'
        },
        created_at: created_at
    }

    try {
        let newkyc = new Kyc(kycobject)
        await newkyc.save();
        console.log('Information submitted successfully.', newkyc)
        let wallet = { success: 1, msg: "Information submitted successfully" };
        let wallet_details = JSON.stringify(wallet);
        return res.send(wallet_details);
    }
    catch (err) {
        let wallet = { success: 0, msg: "Something went wrong please try again" };
        let wallet_details = JSON.stringify(wallet);
        return res.send(wallet_details);
    }
}

module.exports = {
    addcontentCreater,
    checkContentCreaterId,
    checkContentCreater,
    checkContentCreaterPass,
    checkContentCreaterPassID,
    createCipher,
    createAtTimer,
    sendActivationMail,
    updatecontentCreaterStatus,
    sendNewPasswordMail,
    updateContentCreaterPassword,
    updateContentCreaterPasswordID,
    updateContentCreaterProfile,
    addKyc
}