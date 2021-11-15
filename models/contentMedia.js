const moongoose = require('mongoose');

const validator = require('validator');

const bcrypt = require('bcryptjs');

/**How access and token works only we are perfoming just restructuring****/

var ContentMediaSchema =  new moongoose.Schema({

   content_id:[{ type: moongoose.Schema.Types.ObjectId, ref: 'paintings' }],

    media_name:{
        type:String,
        default:null
     },
     media_type:{
         type:[],
         default:null
     },
    created_at: { 
                    type: String,
                    default: new Date()
                },
    updated_at: {

            type: String,
            default: null
         }

});


var ContentMediaInfo =  moongoose.model('content_media',ContentMediaSchema);

module.exports = {ContentMediaInfo:ContentMediaInfo};
