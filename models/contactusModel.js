const moongoose = require('mongoose');

const validator = require('validator');

const bcrypt = require('bcryptjs');

/**How access and token works only we are perfoming just restructuring****/

var ContactUsSchema =  new moongoose.Schema({

    name:{
        type:String,
        
    },
    email:{
        type:String,
    },
    phone:{

        type:String,
        default:null
    },
    message:{

        type:String,
        default:null
    }, 
    created_at: { 
        type: String,
        default: new Date()
    },
  
});
   
    
  
  


var ContactInfo =  moongoose.model('contactus',ContactUsSchema);

module.exports = {ContactInfo:ContactInfo};
