const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const catalogRouter = require('./routes/catalog'); // import routes for 'catalog' area of site
const compression = require('compression');
const helmet = require('helmet');

const app = express(); // create the Express application object

// set up rate limiter: maximum of twenty requests per minute
const RateLimit = require('express-rate-limit');
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
});
// apply rate limiter to all requests
app.use(limiter);

// add helmet to the middleware chain
// set CSP headers to allow our Bootstrap and Jquery to be served
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      'script-src': ["'self'", 'code.query.com', 'cdn.jsdelivr.net'],
    },
  })
);

// set up mongoose connection
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const dev_db_url =
  'mongodb+srv://matthewaubert:VEJ7I6WPSkBarfJI@cluster0.ediprkq.mongodb.net/local_library?retryWrites=true&w=majority&appName=Cluster0';
const mongoDB = process.env.MONGODB_URI || dev_db_url;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(compression()); // compress all routes

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalogRouter); // add catalog routes to middleware chain

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
