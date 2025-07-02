const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const app = express();

// 1) MIDDLEWARES
app.use(morgan('dev'));

app.use(express.json());

app.use((req, res, next) => {
   console.log('Hello from the middleware');
   next(); // IMPORTANT if not, response not send back to client
});

app.use((req, res, next) => {
   req.requestTime = new Date().toISOString();
   next();
});

// 2) ROUTES HANDLERS
const tours = JSON.parse(
   fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
   console.log(req.requestTime);
   res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
         tours,
      },
   });
};

const getTour = (req, res) => {
   console.log(req.params);
   const id = req.params.id * 1;
   const tour = tours.find((el) => el.id === id);

   // if (id > tours.length) {
   if (!tour) {
      return res.status(404).json({
         status: 'fail',
         message: 'Invalid ID',
      });
   }

   res.status(200).json({
      status: 'success',
      data: {
         tour,
      },
   });
};

const createTour = (req, res) => {
   // console.log(req.body); // If you dont use middleware, express doesn't read the body data, so log for req.body will be undefined

   const newId = tours[tours.length - 1].id + 1;
   const newTour = Object.assign({ id: newId }, req.body);

   tours.push(newTour);

   fs.writeFile(
      `${__dirname}/dev-data/data/tours-simple.json`,
      JSON.stringify(tours),
      (err) => {
         res.status(201).json({
            status: 'success',
            data: {
               tour: newTour,
            },
         });
      }
   );
};

const updateTour = (req, res) => {
   if (req.params.id * 1 > tours.length) {
      return res.status(404).json({
         status: 'fail',
         message: 'Invalid ID',
      });
   }
   res.status(200).json({
      status: 'success',
      data: {
         tour: '<Updated tour here...>',
      },
   });
};

const deleteTour = (req, res) => {
   if (req.params.id * 1 > tours.length) {
      return res.status(404).json({
         status: 'fail',
         message: 'Invalid ID',
      });
   }
   res.status(204).json({
      status: 'success',
      data: null,
   });
};

const getAllUsers = (req, res) => {
   res.status(500).json({
      status: 'error',
      message: 'This route is not yet defined',
   });
};

// 3) ROUTES

// app.get('/api/v1/tours', getAllTours);
// req.params: object that store all the parameters from the url
// Add ? for optinal parameters
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app.route('/api/v1/tours').get(getAllTours).post(createTour);

app.route('/api/v1/tours/:id')
   .get(getTour)
   .patch(updateTour)
   .delete(deleteTour);

app.route('api/v1/users').get(getAllUsers).post(createUser);

app.route('/api/v1/users/:id')
   .get(getUser)
   .patch(updateUser)
   .delete(deleteUser);

// 4) START SERVER
const port = 3000;
app.listen(port, () => {
   console.log(`App running on port ${port}...`);
});
