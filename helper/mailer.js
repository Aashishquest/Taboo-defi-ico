const nodemailer = require("nodemailer");

async function mail(to_mail, mail_subject, mail_content) {

    const mailOptions = {
        from: 'fsdevelopersg@gmail.com',//'noreply@justyours.me',
        to: to_mail,
        subject: mail_subject,
        html: mail_content
    };

    const smtpTransport = nodemailer.createTransport({
        
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 443,
        secure:true,
        auth: {
            user: 'fsdevelopersg@gmail.com',
            pass: 'fsdeveloper21'
           // user: 'noreply@justyours.me', //'lokeshmaheshwari@questglt.com',
            //pass: 'Login90%' //'Login90%'      
        }
    });
    //'noreply@justyours.me'
    //'Login90%'
    return new Promise((resolve, reject) => {
        smtpTransport.sendMail(mailOptions, function (err, result) {
            if (err) {
                //console.log(err)
                reject(0);
            }
            else {
                console.log(result)
                resolve(1)
            }
        })
    })
}

module.exports = {
    mail,
}
