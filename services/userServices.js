const { hashSync } = require("bcryptjs");
const moment = require("moment");
const crypto = require('crypto');
const { generateCode, generateActivationToken } = require('../helper/userHelper');
const { Registration, Userwallet, Importwallet, Tokensettings, Tokendetails, OrderDetails, RefCode, FAQ, ContactInfo, activationTokens } = require('../models/contact');
const {  UserInfo } = require('../models/userModel');
const { KycInfo } =require('../models/kycModel');
const { mail } = require('../helper/mailer');
const {NewsInfo}=require('../models/NewsLetter');

const addUser = async (userDetails, pass, created) => {
  const userObject = {
    name: userDetails.name,
    
    email: userDetails.email,
    password: pass,
    created_at: created,
    mobile: userDetails.mobile,
    image:'author-2.jpg'
  };
  try {
    const user = new UserInfo(userObject);
    await user.save();
    return userObject;
  } catch (error) {
    console.log(error)
    return null;
  }
};

const addNewsLetter=async(email)=>{
    try{
      const news = new NewsInfo({email:email});
      await news.save().then((result)=>{
        return result
      });
     console.log(news);
    }catch(e){console.log(e);}
}

const findNewsLetter=async()=>{
  try{
       return await NewsInfo.find({}).sort({_id:-1});
     }catch(e){console.log(e);}
}




const addUserByWallet = async (userOBJ) => {
 
  try {
    const user = new UserInfo(userOBJ);
    await user.save();
    return user;
  } catch (error) {
    console.log(error)
    return null;
  }
};




const updateProfile = async (image,re_us_id,userData) => {
  let user = await checkUserId(re_us_id);
  if (user) {
     user.image=image;
     user.name=userData.name;
     user.mobile=userData.phone;
     user.instagram=userData.instagram;
     user.twitter=userData.twitter;
     user.website=userData.website;
     user.description=userData.description;
    try {
      await user.save();
      return user;
    }
    catch (error) {
      return null;
    }
  }
}


const checkUserId = async (user_id) => {
  let user = await UserInfo.findOne({ '_id': user_id });
  if (user) {
    return user;
  }
};

const checkUser = async (email) => {
  let user = await UserInfo.findOne({ 'email': email });
  if (user) {
    return user;
  }
};

const findAdmin = async () => {
  let user = await UserInfo.findOne({ 'user_role':'admin' });
  if (user) {
    return user;
  }
};

const checkUserByID = async (user_id) => {
  let user = await UserInfo.findOne({ '_id':user_id });
  if (user) {
    return user;
  }
};

const checkUserByWallet = async (address) => {
  let user = await UserInfo.findOne({ 'wallet_address':address});
  if (user) {
    return user;
   }
};

const checkUserPass = async (email, password) => {
  let user = await UserInfo.findOne({ 'email': email, 'password': password });
  if (user) {
    return user;
  }
};

const saveKyc=async (filename,user_id,data)=>{
    let kycData={user_id:user_id,
                 image:filename,
                 fullname:data.fullname,
                 dob:data.dob,
                 document_type:data.document_type,
                 document_number:data.document_number,
                 country:data.country };
    try{
      let kyc= new KycInfo(kycData);
      await kyc.save();
      return kycData;
    }catch(error){
      console.log(error);
       return null;
    }
    
    
}


const getKycBYKycId = async (user_id) => {
  let kycData = await KycInfo.findOne({ 'user_id':user_id });
  if (kycData) {
    return kycData;
  }
};
const getKycBYId = async (user_id) => {
  let kycData = await KycInfo.find({ 'user_id':user_id });
  if (kycData) {
    return kycData;
  }
};

const getKycList=async(req,res)=>{
 
  let users= await UserInfo.aggregate([
    { $lookup:
       {
         from: 'kycs',
         localField:'_id',
         foreignField:'user_id',
         as: 'kycinfo'
       }
     },
     { "$unwind": "$kycinfo" },
                { "$project": {
                  "name":1,
                  "image":1,
                  "status":1,
                  "email":1,
                  "_id":1,
                  "kycinfo._id": 1,
                  "kycinfo.user_id": 1,
                  "kycinfo.image": 1,
                  "kycinfo.status":1
                } }
    ]).sort({_id:-1});
  console.log(users);
    return users;
    
}


const getKycDetails=async(id)=>{
 
  let kyc=KycInfo.find({"user_id":id});
  console.log(kyc);
    return kyc;
    
}



const checkUserPassID = async (id, password) => {
  let user = await Registration.findOne({ '_id': id, 'password': password });
  if (user) {
    return user;
  }
};

const updateUserPassword = async (email, password) => {
  try {
    let user = await Registration.findOne({ 'email': email });
    if (user) {
      await Registration.update({ 'email': email }, { $set: { password: password } });
    }
    let userUpdated = await Registration.findOne({ 'email': email });
    return userUpdated;
  } catch (error) {
    return null;
  }
};

const updateUserPasswordID = async (id, password) => {
  try {
    let user = await UserInfo.findOne({ '_id': id });
    if (user) {
      await UserInfo.updateOne({ '_id': id }, { $set: { password: password } });
    }
    let userUpdated = await UserInfo.findOne({ '_id': id });
    return userUpdated;
  } catch (error) {
    return null;
  }
};


const updateCreater = async (id,userstatus) => {
  try {
    let user = await UserInfo.findOne({ '_id': id });
    if (user) {
      await UserInfo.updateOne({ '_id': id }, { $set: { isApproved:userstatus} });
      }
    let userUpdated = await UserInfo.findOne({ '_id': id });
    return userUpdated;
  } catch (error) {
    return null;
  }
};

const updateAccount=async(id,userstatus)=>{
  try {
    let user = await UserInfo.findOne({ '_id': id });
    if (user) {
      await UserInfo.updateOne({ '_id': id }, { $set: {status:userstatus} });
      }
    let userUpdated = await UserInfo.findOne({ '_id': id });
    return userUpdated;
  } catch (error) {
    return null;
  }

};

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
const creaters=async()=>{
  let users= await UserInfo.find({user_role:"creater"}).sort({_id:-1}).then(users=>{
    console.log(`Successfully found ${users.length} documents.`)
    users.forEach(console.log)
    return users;
  }).catch(err => console.error(`Failed to find documents: ${err}`));
  if(users){
    return users;
  }
}



const sendActivationMail = async function (newuser, req) {
  let activationTokenId = await generateActivationToken(newuser)
  console.log(`26 userServices TokenId`, activationTokenId)
  const subject = 'JUSTyours Account Activation'
  const reciever = `${newuser.email}`
  const message = `
  <h3> Hello ${newuser.name}, </h3>
  <p>Thank you for registering on JUSTyours.</p>
  <p>To activate your account please follow this link:</p>
  <p> <a target="_" href="http://${req.headers.host}/activate/user/${activationTokenId}" </a>Click Here</p>
  <p>This link will get deactivated in 30 min</p>
  <p>Team JUSTyours</p>`;

  let sendmail = await mail(reciever, subject, message);
  if (sendmail) {
    return true;
  }
}

const updateUserStatus = async function (user_id) {
  try {
    let user = await Registration.findOne({ '_id': user_id });
    if (user) {
      await Registration.update({ '_id': user_id }, { $set: { email_verify_status: true } });
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

const updateUserPrivateKey=async(user_id,private_key)=>{

  try {
    let user = await UserInfo.findOne({ '_id': user_id });
    if (user) {
      await UserInfo.update({ '_id': user_id }, { $set: {private_key:private_key } });
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

const updateKycStatus = async(id,status)=> {
  try {
    let kycdata= await KycInfo.findOne({ '_id':id });
    if (kycdata) {
      await KycInfo.updateOne({ '_id':id }, { $set: {'status':status} });
      if(status=="rejected"){
        await UserInfo.updateOne({ '_id': kycdata.user_id }, { $set: { isApproved:"Rejected"} });

       }else{
         await UserInfo.updateOne({ '_id': kycdata.user_id }, { $set: { isApproved:"Approved"} });

        }
        let kycDetail= await KycInfo.findOne({ '_id':id });

      return kycDetail;
    }
    else {
      return false;
    }
  } catch (err) {
    console.log(err)
    return false
  }
}

const updateTier=async(address,tier)=>{
   try{
      await UserInfo.updateOne({wallet_address:address},{$set:{subscription:tier}});
     
      let user = await UserInfo.findOne({ 'wallet_address':address});
      return user;
   }catch(e){console.log(e);}
}

const sendNewPasswordMail = async function (req, otp, user_id) {
  console.log(otp)
  let user = await Registration.findOne({ '_id': user_id });

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
 const totalCreators=async()=>{
     let total=await UserInfo.find({"user_role":"creater",isApproved:'Approved'}).count();
     return total;
 }

 

module.exports = {
  addUser,
  checkUserId,
  checkUser,
  checkUserPass,
  checkUserPassID,
  updateUserPassword,
  updateUserPasswordID,
  createCipher,
  createAtTimer,
  updateProfile,
  sendActivationMail,
  updateUserStatus,
  sendNewPasswordMail,
  creaters,
  checkUserByID,
  updateCreater,
  saveKyc,
  getKycBYId,
  getKycBYKycId,
  getKycList,
  getKycDetails,
  updateKycStatus,
  checkUserByWallet,
  addUserByWallet,
  totalCreators,
  updateUserPrivateKey,
  updateAccount,
  addNewsLetter,
  findAdmin,
  findNewsLetter,
  updateTier
};
