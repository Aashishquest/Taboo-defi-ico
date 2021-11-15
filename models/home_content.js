const moongoose = require('mongoose');

const validator = require('validator');

const bcrypt = require('bcryptjs');

/**How access and token works only we are perfoming just restructuring****/

var BannerSchema =  new moongoose.Schema({

    title:{
        type:String
    },
    content:{
        type:String
    },
    banner_image:{
        type: String
    },   

    created_at: { 
        type: String,
        default: Date.now 
    },
    
    created_by: {
        type:Number,
        default:0
    },

    updated_at: {

            type: String,
            default: null
    },
    deleted_at: {

            type: String,
            default: null
    },

    updated_by: {

            type:String,
            default:0
    },

    status:{

        type:String,
        enum: ['active', 'inactive'],
        default:'active'

    },
    deleted:{

         type:String,
         enum: ['0', '1'],
         default:'0'
    },
});




var BannerInfo =  moongoose.model('tbl_banners',BannerSchema);


// /next/ 
var AboutusSchema =  new moongoose.Schema({

    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    image:{
        type: String
    },   

    created_at: { 
                    type: String,
                    default: Date.now 
                },
    
    created_by: {

            type:Number,
            default:0
    },

    updated_at: {

            type: String,
            default: null
    },
    deleted_at: {

            type: String,
            default: null
    },

    updated_by: {

            type:String,
            default:0
    },
    deleted:{

         type:String,
         enum: ['0', '1'],
         default:'0'
    },
});




var Aboutus =  moongoose.model('tbl_aboutus',AboutusSchema);

/******************************/

var PartnerSchema =  new moongoose.Schema({

    title:{
        type:String,
        required:true
    },
    url:{
        type:String,
        required:true
    },
    partner_image:{
        type: String
    },   

    created_at: { 
                    type: String,
                    default: Date.now 
                },
    
    created_by: {

            type:Number,
            default:0
    },

    updated_at: {

            type: String,
            default: null
    },
    deleted_at: {

            type: String,
            default: null
    },

    updated_by: {

            type:String,
            default:0
    },

    status:{

        type:String,
        enum: ['active', 'inactive'],
        default:'active'

    },
    deleted:{

         type:String,
         enum: ['0', '1'],
         default:'0'
    },
});




var PartnerInfo =  moongoose.model('tbl_partner',PartnerSchema);

/***********/
var KeyfeatureSchema =  new moongoose.Schema({

    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    icon:{
        type: String
    },   

    created_at: { 
                    type: String,
                    default: Date.now 
                },
    
    created_by: {

            type:Number,
            default:0
    },

    updated_at: {

            type: String,
            default: null
    },
    deleted_at: {

            type: String,
            default: null
    },

    updated_by: {

            type:String,
            default:0
    },

    status:{

        type:String,
        enum: ['active', 'inactive'],
        default:'active'

    },
    deleted:{

         type:String,
         enum: ['0', '1'],
         default:'0'
    },
});




var KeyFeaturesInfo =  moongoose.model('tbl_key_features',KeyfeatureSchema);

/******************************/

var DocumentSchema =  new moongoose.Schema({

    document_name:{
        type:String,
        required:true
    },
   
    document_type:{
        type: String,
        required:true
    },   

    created_at: { 
                    type: String,
                    default: Date.now 
                },
    
    created_by: {

            type:Number,
            default:0
    },

    updated_at: {

            type: String,
            default: null
    },
    deleted_at: {

            type: String,
            default: null
    },

    updated_by: {

            type:String,
            default:0
    },

    status:{

        type:String,
        enum: ['active', 'inactive'],
        default:'active'

    },
    deleted:{

         type:String,
         enum: ['0', '1'],
         default:'0'
    },
});




var DocumentInfo =  moongoose.model('tbl_document_list',DocumentSchema);

/***************/

// /next/ 
var GetInTouchSchema =  new moongoose.Schema({

    title:{
        type:String,
        required:true
    },
    content:{
        type:String
    },
    address:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },  
    youtube:{
        type:String
    },  
    twitter:{
        type:String
    }, 
    facebook:{
        type:String
    }, 
    instagram:{
        type:String
    }, 
    created_at: { 
                    type: String,
                    default: Date.now 
                },
    
    created_by: {

            type:Number,
            default:0
    },

    updated_at: {

            type: String,
            default: null
    },
    deleted_at: {

            type: String,
            default: null
    },

    updated_by: {

            type:String,
            default:0
    },
    deleted:{

         type:String,
         enum: ['0', '1'],
         default:'0'
    },
});




var GetInTouch =  moongoose.model('tbl_siteinfo',GetInTouchSchema); 

module.exports = {
   
    BannerInfo:BannerInfo,
    Aboutus:Aboutus,
    PartnerInfo:PartnerInfo,
    KeyFeaturesInfo:KeyFeaturesInfo,
    DocumentInfo:DocumentInfo,
    GetInTouch:GetInTouch
  
};
