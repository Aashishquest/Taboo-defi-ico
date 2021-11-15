const moongoose = require('mongoose');

const validator = require('validator');

const bcrypt = require('bcryptjs');

/**How access and token works only we are perfoming just restructuring****/

var NewsSchema =  new moongoose.Schema({

      email:{
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


var NewsInfo =  moongoose.model('News_letters',NewsSchema);

module.exports = {NewsInfo:NewsInfo};
