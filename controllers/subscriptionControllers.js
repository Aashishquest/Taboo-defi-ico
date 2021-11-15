const { compareSync } = require("bcryptjs");
const moment = require('moment');
const request = require('request');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const subscriptionServices = require("../services/subscriptionServices");

const subscription = async(req,res)=>{
    console.log(req.body)
    
    let newsubscription = await subscriptionServices.addSubscription(req.body);
    console.log('newsubscription:',newsubscription)
    res.send(newsubscription)
}
const getSubscription = async(req,res)=>{
    
    
    let allubscription = await subscriptionServices.getAllSubscription();
    console.log('allubscription:',allubscription)
    res.send(allubscription)
}
const findByIdSubscription = async(req,res)=>{
    
    console.log('subscription id:',req.query)
    let subscription = await subscriptionServices.getById(req.query.subs_id);
    console.log('subscription:',subscription)
    res.send(subscription)
}
// const updateSubscription = async(req,res)=>{

//     console.log('subscription id:',req.body)
//     let subscription = await subscriptionServices.updateById(req.body);
//     console.log('subscription:',subscription)
//     res.send(subscription)
    
// }
module.exports = {
subscription,
getSubscription,
findByIdSubscription,
//updateSubscription
};
