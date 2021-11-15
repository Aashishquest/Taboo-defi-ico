const moongoose = require('mongoose');

const validator = require('validator');

const bcrypt = require('bcryptjs');

/**How access and token works only we are perfoming just restructuring****/

var SubscriptionSchema =  new moongoose.Schema({

    user_id:[{ type: moongoose.Schema.Types.ObjectId, ref: 'users' }],
    plan_id:{
        type:String,
        default: null 
    },
    plan_name:{
        type:String,
       
    },
    plan_price:{
        type:Number,
        default:null
    },
    created_at: { 
        type: String,
        default: new Date()
    },
    updated_at: {
        type: String,
        default: null
    },
    status:{

        type:String,
        default:'active'

    },
   
   
});


var subscriptionInfo =  moongoose.model('subscriptions',SubscriptionSchema);

module.exports = {subscriptionInfo:subscriptionInfo};
