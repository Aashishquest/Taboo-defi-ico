const moongoose = require('mongoose');

const validator = require('validator');

const bcrypt = require('bcryptjs');

/**How access and token works only we are perfoming just restructuring****/

var UserSchema =  new moongoose.Schema({

    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        validate:{

            validator:validator.isEmail,
            message:'{VALUE} Entered Invalid Email'
        }

    },
    mobile:{

        type:String,
        default:null
    },
    username:{

        type:String,
        default:null
    }, 
    wallet_address:{
        type:String,
        default:null
    },
    image:{
        type:String,
        default:null
    },
    description:{
        type:String,
        default:null
    },
    instagram:{
        type:String,
        default:null
    },
    twitter:{
        type:String,
        default:null
    },
    website:{
        type:String,
        default:null
    },
    subscription:{
        type:String,
        default:null
    },
    password:{
        type:String,
        required:true
    },
    private_key:{
       type:String,
       default:null,
      },
    created_at: { 
                    type: String,
                    default: new Date()
                },
    
    created_by: {

            type:Number,
            default:0
    },

    updated_at: {

            type: String,
            default: null
    },

    updated_by: {

            type:String,
            default:0
    },
    email_varified: {
        type:String,
        default:"false"

   },
    isApproved: {
		type: String,
        default:"pending"
	 },

    status:{

        type:String,
        default:'active'

    },
    user_role:{

        type:String,
        enum: ['user', 'creater','admin'],
        default:'creater'

    }
   
});


var UserInfo =  moongoose.model('users',UserSchema);

module.exports = {UserInfo:UserInfo};
