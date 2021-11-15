const { hashSync } = require("bcryptjs");
const moment = require("moment");
const crypto = require('crypto');
const { generateCode, generateActivationToken } = require('../helper/userHelper');
const {  UserInfo } = require('../models/userModel');
const {subscriptionInfo } = require('../models/subscriptionModel');
const { mail } = require('../helper/mailer');
const checkSubscriptionId = async (subs_id) => {
  let data = await UserInfo.findOne({ '_id': subs_id });
  if (data) {
    return data;
  }
};
const addSubscription = async(subsObj)=>{
  const subsObject={
      user_id    : subsObj.user_id,
      plan_id    : subsObj.plan_id,
      plan_name  : subsObj.plan_name,
      plan_price : subsObj.plan_price,
  }
  try {
    const subs = new subscriptionInfo(subsObject);
    var resp = await subs.save();
    return resp;
  } catch (error) {
    console.log(error)
    return null;
  }
}

const getAllSubscription = async()=>{
 
  try {
    var resp = await subscriptionInfo.find();
    return resp;
  } catch (error) {
    console.log(error)
    return null;
  }
}
 
const getById = async(id)=>{
 
  try {
    var resp = await subscriptionInfo.findOne({_id:id});
    return resp;
  } catch (error) {
    console.log(error)
    return null;
  }
}
// const updateById = async(data)=>{
//  let isdata = await checkSubscriptionId(data.subs_id)
//  if(isdata){

//    try {
//      var resp = await subscriptionInfo.findOne({_id:id});
//      return resp;
//    } catch (error) {
//      console.log(error)
//      return null;
//    }
//  }
// }
module.exports = {
  addSubscription,
  getAllSubscription,
  getById,
  //updateById
};
