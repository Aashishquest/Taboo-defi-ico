function authuser(req, res, next) {
    if (req.session&&req.session.role) 
      {
        const err = new Error('You shall not pass');
        err.statusCode = 401;
        console.log(req.session);
        if(req.session.role!="user"){
            res.redirect('/users/dashboard');

        }
        //next(err);
       }
      
    next();
}

module.exports = authuser;