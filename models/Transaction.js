const moongoose = require('mongoose');

const validator = require('validator');

const bcrypt = require('bcryptjs');

/**How access and token works only we are perfoming just restructuring****/

var TransactionSchema =  new moongoose.Schema({

     user_id:[{ type: moongoose.Schema.Types.ObjectId, ref: 'users' }],

     wallet_address:{
        type:String,
        default:null
        },
      amount:{
        type:String,
        default:null
        },
     status:{
        type:String,
        default:"0"
    },
    created_at: { 
                    type: String,
                    default: new Date()
                },
    updated_at: {

            type: String,
            default: null
    },
});


var TransactionInfo =  moongoose.model('transactions',TransactionSchema);

module.exports = {TransactionInfo:TransactionInfo};
