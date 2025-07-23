const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) MIDDLEWARES
// morgan for logging simple information of request
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
   app.use(morgan('dev'));
}
// body parser in 14.x.x version. Help access to req.body
app.use(express.json());

app.use(express.static(`${__dirname}/public`));

// Custom middleware
// app.use((req, res, next) => {
//    console.log('Hello from the middleware');
//    next(); // IMPORTANT
// });

// Custom middleware to set request time
app.use((req, res, next) => {
   req.requestTime = new Date().toISOString();
   next();
});

// 2) ROUTES
// Mount router
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// 3) ERROR HANDLING
// '*' wildcard means all routes that are not defined above
// This should be the last middleware
// If it not, it will catch all routes and return a 404 error, undefined route
app.all('*', (req, res, next) => {
   // res.status(404).json({
   //    status: 'fail',
   //    message: `Can't find ${req.originalUrl} on this server!`
   // });
   const err = new Error(`Can't find ${req.originalUrl} on this server!`);
   err.statusCode = 404;
   err.status = 'fail';
   next(err);
});

// Write a handler operational errors
app.use((err, req, res, next) => {
   err.statusCode = err.statusCode || 500;
   err.status = err.status || 'error';

   res.status(err.statusCode).json({
      status: err.status,
      message: err.message
   });
});

module.exports = app;
