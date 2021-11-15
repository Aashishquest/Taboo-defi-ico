function authenticate(req, res, next) {
    if (!req.session|| !req.session.role) 
      {
        const err = new Error('You shall not pass');
        err.statusCode = 401;
        console.log(req.session);

        res.redirect('/users/login');
        //next(err);
       }
       else
       {
         if(req.session.role=="user"){

            res.redirect('/');
              
           }
       }
    next();
}

module.exports = authenticate;