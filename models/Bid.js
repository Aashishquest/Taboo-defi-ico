const moongoose = require('mongoose');

const validator = require('validator');

const bcrypt = require('bcryptjs');

/**How access and token works only we are perfoming just restructuring****/

var BidSchema =  new moongoose.Schema({

    content_id:[{ type: moongoose.Schema.Types.ObjectId, ref: 'paintings' }],

   
     wallet_address:{
        type:String,
        default:null
    },
     
    bid_amount:{
        type:String,
        default:null
    },
     status:{
        type:String,
        default:"0"
    },
    created_at: { 
                    type: String,
                    default: new Date().toISOString()
                },
    updated_at: {

            type: String,
            default: null
    },
});


var BidInfo =  moongoose.model('content_bids',BidSchema);

module.exports = {BidInfo:BidInfo};
