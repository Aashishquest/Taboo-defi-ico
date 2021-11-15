const moment = require('moment');
const { activationTokens } = require('../models/contact');
function generateCode() {
    var string = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';

    var len = string.length;
    for (let i = 0; i < 10; i++) {
        code += string[Math.floor(Math.random() * len)];
    }
    return code;
}

function calculateDays(startDate, endDate) {
    var start_date = moment(startDate, 'YYYY-MM-DD HH:mm:ss');
    var end_date = moment(endDate, 'YYYY-MM-DD HH:mm:ss');
    var duration = moment.duration(end_date.diff(start_date));
    var days = duration.asDays();
    return parseInt(days);
}

function calculateHours(startDate, endDate) {
    var start_date = moment(startDate, 'YYYY-MM-DD HH:mm:ss');
    var end_date = moment(endDate, 'YYYY-MM-DD HH:mm:ss');
    var duration = moment.duration(end_date.diff(start_date));
    var days = duration.asHours();
    return days;
}

const createCipher = async (text) => {
    let mykey1 = crypto.createCipher('aes-128-cbc', 'mypass');
    let mystr1 = mykey1.update(text, 'utf8', 'hex')
    mystr1 += mykey1.final('hex');
    return mystr1;
};


const generateActivationToken = async function (newuser) {
    let oldtoken = await activationTokens.findOne({ email: newuser.email })
    let activationTokenId
    if (oldtoken) {
        activationTokenId = oldtoken._id
    }
    else {
        let tokenObject = {
            _userId: newuser._id,
            email: newuser.email,
        }
        //console.log('Activation_token', tokenObject)
        try {
            let token = new activationTokens(tokenObject)
            await token.save()
            return token._id;
        } catch (err) {
            return false;
        }
    }
    return activationTokenId
}


module.exports = {
    generateCode,
    calculateDays,
    calculateHours,
    generateActivationToken
}