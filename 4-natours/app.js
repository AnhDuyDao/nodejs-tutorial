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
app.use((req, res, next) => {
   console.log('Hello from the middleware');
   next(); // IMPORTANT
});

// Custom middleware to set request time
app.use((req, res, next) => {
   req.requestTime = new Date().toISOString();
   next();
});

// 2) ROUTES
// Mount router
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
