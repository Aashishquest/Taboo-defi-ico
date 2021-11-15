var isAdmin = function(req, res, next) {
    res.redirect('/admin');
}

var isUser = function(req, res, next) {
    let check_user = req.session.is_user_logged_in;
    let check_user_id=req.session.re_us_id;
    if (check_user != undefined && check_user !="" && check_user==true && check_user_id!="") {
        res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        next();
    } else {
        req.flash('danger', 'Please log in first.');
        res.redirect('/Login');
    }
}

module.exports = {
    isUser:isUser,
    isAdmin:isAdmin
}


