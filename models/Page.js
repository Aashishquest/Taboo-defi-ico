const moongoose = require('mongoose');

const validator = require('validator');

const bcrypt = require('bcryptjs');

/**How access and token works only we are perfoming just restructuring****/

var PageSchema =  new moongoose.Schema({

     user_id:[{ type: moongoose.Schema.Types.ObjectId, ref: 'users' }],

      name:{
        type:String,
        default:null
        },
      title:{
        type:String,
        default:null
        },

       description:{
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


var PageInfo =  moongoose.model('pages',PageSchema);

module.exports = {PageInfo:PageInfo};
