const moongoose = require('mongoose');

const validator = require('validator');

const bcrypt = require('bcryptjs');

/**How access and token works only we are perfoming just restructuring****/

var PaintingSchema =  new moongoose.Schema({

   title:{

        type:String
    },
    total_copy:{
        type:String,
        required:true
    },

    copy_for_sale:{
        type:String,
        required:true,
    },
    category:{

        type:String
    },
    for_sale:{

        type:String
    },
    basic_price:{

        type:Number,

    },
    plateform_fees:{

        type:String,

    },
    total_taboo:{

        type:String,

    },
    payment_in:{

        type:String
    },

    image:{

        type: String

    },
    media_type:{
        type:[],
        default:null
    },
    available_to:{
        type:[],
        required:true
    },
    contract_type:{
        type:String,
        required:true
    },
    meta_tag:{
        type:String,
         default:null
    },
    description:{
        type:String,
        default:null
    },
    bid_start:{
        type:String,
        default:null
    },
    bid_end:{
        type:String,
        default:null
    },
    bid_min_amount:{
        type:String,
        default:null
    },
    created_at: { 
                    type: String,
                    default: new Date().toISOString()
                },
    
    created_by:[{ type: moongoose.Schema.Types.ObjectId, ref: 'users' }],
    updated_at: {

            type: String,
            default: null
    },

    updated_by: {

            type:String,
            default:0
    },
    approved_at:{
        type:String,
        default:null
    }
    ,
    status:{

        type:String,
        default:'pending'

    },

});


var PaintingInfo =  moongoose.model('paintings',PaintingSchema);

module.exports = {PaintingInfo:PaintingInfo};
