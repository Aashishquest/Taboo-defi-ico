var createError = require('http-errors');
var express = require('express');
const flash = require('express-flash');
var path = require('path');
var cookieParser = require('cookie-parser');
//const session = require('./middleware/session');
var session = require('express-session')
require('dotenv').config()

var fs = require('fs-extra');
var logger = require('morgan');
var expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');

const cors = require('cors')

var app = express();

app.use(session({ 
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 600000 }
}));


 mongoose.connect('mongodb+srv://data123:data123@cluster0.exouw.mongodb.net/NFT?retryWrites=true&w=majority')
    .then(() => console.log('MongoDB Database Connected'))
    .catch(err => console.log(err)) 



/*mongoose.connect('mongodb://localhost:27017/NFT', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Database Connected'))
    .catch(err => console.log(err))*/ 

app.use(cors({
  credentials: true
}));


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash())

app.use(expressLayouts);
app.set('layout', 'layouts/backend/adminLayout');
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.role=req.session.role;
  res.locals.name=req.session.re_usr_name;
  res.locals.err_msg=req.flash('err_msg');
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
