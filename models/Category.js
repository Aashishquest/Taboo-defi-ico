const moongoose = require('mongoose');

const validator = require('validator');

const bcrypt = require('bcryptjs');

/**How access and token works only we are perfoming just restructuring****/

var CategorySchema =  new moongoose.Schema({

    content_id:[{ type: moongoose.Schema.Types.ObjectId, ref: 'paintings' }],

   
     name:{
        type:String,
        default:null
    },

    image:{
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


var CategoryInfo =  moongoose.model('categories',CategorySchema);

module.exports = {CategoryInfo:CategoryInfo};
