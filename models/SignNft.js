const moongoose = require('mongoose');

const validator = require('validator');

const bcrypt = require('bcryptjs');

/**How access and token works only we are perfoming just restructuring****/

var SignNftDetailSchema =  new moongoose.Schema({

    content_id:[{ type: moongoose.Schema.Types.ObjectId, ref: 'paintings' }],

     min_price:{
        type:String,
        required:true
      },
    signature:
      {
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
                    default: new Date().toISOString()
                },
    updated_at: {

            type: String,
            default: null
    },
});


var SignNftInfo =  moongoose.model('SignNft_details',SignNftDetailSchema);

module.exports = {SignNftInfo:SignNftInfo};
