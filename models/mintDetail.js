const moongoose = require('mongoose');

const validator = require('validator');

const bcrypt = require('bcryptjs');

/**How access and token works only we are perfoming just restructuring****/

var MintDetailSchema =  new moongoose.Schema({

    content_id:[{ type: moongoose.Schema.Types.ObjectId, ref: 'paintings' }],

    trx_hash:{
        type:String,
        required:true
      },
    wallet_address:{
        type:String,
        default:null
    },
    token_id:{
        type:String,
        default:null
    },
    token_url:{
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


var MintInfo =  moongoose.model('mint_details',MintDetailSchema);

module.exports = {MintInfo:MintInfo};
