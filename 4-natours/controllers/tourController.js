const fs = require('fs');

const tours = JSON.parse(
   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkId = (req, res, next, val) => {
   console.log(`Tour id is: ${val}`);
   if (req.params.id * 1 > tours.length) {
      // Need to return because it will go to the next middleware and keep response and error
      return res.status(404).json({
         status: 'fail',
         message: 'Invalid ID',
      });
   }
   next();
};

exports.getAllTours = (req, res) => {
   console.log(req.requestTime);
   res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
         tours,
      },
   });
};

exports.getTour = (req, res) => {
   console.log(req.params);
   const id = req.params.id * 1;
   const tour = tours.find((el) => el.id === id);
   res.status(200).json({
      status: 'success',
      data: {
         tour,
      },
   });
};

exports.createTour = (req, res) => {
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

exports.updateTour = (req, res) => {
   res.status(200).json({
      status: 'success',
      data: {
         tour: '<Updated tour here...>',
      },
   });
};

exports.deleteTour = (req, res) => {
   res.status(204).json({
      status: 'success',
      data: null,
   });
};
