const moongoose = require('mongoose');

const validator = require('validator');

const bcrypt = require('bcryptjs');

/**How access and token works only we are perfoming just restructuring****/

var OrderSchema =  new moongoose.Schema({

    user_id:[{ type: moongoose.Schema.Types.ObjectId, ref: 'users' }],

    content_id:[{ type: moongoose.Schema.Types.ObjectId, ref: 'paintings' }],
    creator_id:[{ type: moongoose.Schema.Types.ObjectId, ref: 'users' }],

    trans_id:{
        type:String,
       },
   nft_hash:{
        type:String,
        default:null
       },   
    user_wallet_address:{
           type:String
         },  
    total:{
       type:String
      },
    status:{

        type:String,
        default:'pending'

    },
    created_at:{ 
                    type: String,
                    default: new Date().toISOString()
                },
   
});

var OrderInfo =  moongoose.model('orders',OrderSchema);

module.exports = {OrderInfo:OrderInfo};
