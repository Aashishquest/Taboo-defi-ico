
var mongoose = require('mongoose');

const validator = require('validator');

var contentCreaterSchema = mongoose.Schema({

    name: {
        type: String
    },
    first_name: {
        type: String
    },

    last_name: {
        type: String
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} Entered Invalid Email'
        }

    },
    email_verify_status: {
        type: Boolean,
        default: false
    },
    mobile_no: {

        type: String,
        default: null
    },
    address: {

        type: String,
        default: null
    },
    username: {

        type: String,
        default: null
    },
    user_address: {

        type: String,
        default: null
    },
    country: {

        type: String,
        default: null
    },
    state: {

        type: String,
        default: null
    },
    city: {

        type: String,
        default: null
    },
    dob: {

        type: String,
        default: null
    },
    password: {
        type: String,

    },

    created_at: {
        type: String
    },
    deleted_at: {
        type: String,
        default: null
    },
    deleted_by: {

        type: String,
        default: null
    },

    updated_at: {

        type: String,
        default: null
    },
    status: {

        type: String,
        enum: ['active', 'inactive'],
        default: 'active'

    },
    deleted: {

        type: String,
        enum: ['0', '1'],
        default: '0'
    },
    profile_image: {

        type: String,

    },
    dataURL: {

        type: String,

    },
    qr_secret: {

        type: String,

    },
    qr_status: {

        type: String,

    },
    ref_code: {

        type: String,

    },
    ref_from: {

        type: String,

    },
    otp: {
        type: String,
    },
    auth: {

        type: String,
        enum: ['email', '2fa'],
        default: 'email'
    },
    type: {
        type: String,
        enum: ['contentCreater', 'user'],
        default: 'contentCreater',
    },
    kycStatus: {
        type: String,
        enum: ['approved', 'rejected', 'pending'],
        default: 'pending'
    },
    genre: {
        type: String,
    },
    birthday: {
        type: Date,
    },
    bio: {
        type: String,
    },
    id1:{
        type: String,
    },
    id2:{
        type: String,
    },
    current:{
        type: String
    }
});

var contentCreaterRegistration = mongoose.model('contentCreator_registration', contentCreaterSchema);

const kycschema = new mongoose.Schema({
    contentCreater_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'contentCreator_registration'
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    dob: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    documenttype: {
        type: String,
        required: true
    },
    documentnumber: {
        type: String
    },
    frontImageName: {
        type: String
    },
    backImageName: {
        type: String
    },
    frontImage: {
        data: Buffer,
        contentType: String
    },
    backImage: {
        data: Buffer,
        contentType: String
    },
    created_at: {
        type: String,
        default: new Date(),
    },
    created_at1: {
        type: String,
        default: new Date()
    },
    updated_at: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: ['approved', 'rejected', 'pending'],
        default: 'pending'
    },
})
let Kyc = mongoose.model('Kyc', kycschema);

module.exports = { contentCreaterRegistration, Kyc }