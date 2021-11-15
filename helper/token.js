const jwt = require('jsonwebtoken');

const { JWT_SECRET_KEY } = require('../config/default.json');

module.exports= (req, res, next) => {

  const { authorization } = req.headers;

  if (!authorization) {
    console.log("authorization : ", authorization)
    return res.status(401).json({ error: "you must be loged in!" })
  }
  
  jwt.verify(authorization, JWT_SECRET_KEY, (error, payload) => {
    if (error) {
      return res.status(401).json({ error: "you must be loged in!" })
    }
    console.log('payload:', payload)
    req.payload= payload;
    next();
  });
}

