if(process.env.NODE_ENV != 'production') 
  require('dotenv').config(); //dotenv kütüphanesini import ettik ve config fonksiyonunu çağırdık. Bu fonksiyon .env dosyasını okuyarak process.env ye değişkenlerimizi ekleyecektir.

//require('dotenv').config(); //dotenv kütüphanesini import ettik ve config fonksiyonunu çağırdık. Bu fonksiyon .env dosyasını okuyarak process.env ye değişkenlerimizi ekleyecektir.

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

var app = express();

//console.log(process.env); //process environment değişkenlerini görmek için kullanılır.


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  console.log('Ben app.js de tanımlanan bir Middlewareim');
  next()
})

//app.jsde bu routerları import ediyoruz.
// app.use('/', require('./routes/index')); // http://localhost:3000/
// app.use('/users', require('./routes/users')); // http://localhost:3000/users
// app.use('/auditlogs', require('./routes/auditlogs')); // http://localhost:3000/auditlogs

// Yukarıdaki gibi tüm routeslarımızı tek tek tanımlamak yerine dinamik routes yapısı kullanacağız.
// dinamik routes için routes daki index.js de düzenleme yapıyoruz.
app.use('/api', require('./routes/index')); // http://localhost:3000/api // / yerine /api yazmamızın sebebi frontende routes tanımlarken backendle çakışmasını önlemek  

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
