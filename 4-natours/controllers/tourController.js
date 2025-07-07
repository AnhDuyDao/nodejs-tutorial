const Tour = require('./../models/tourModel');

// const tours = JSON.parse(
//    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

/*
exports.checkId = (req, res, next, val) => {
   console.log(`Tour id is: ${val}`);
   if (req.params.id * 1 > tours.length) {
      // Need to return because it will go to the next middleware and keep response and error
      return res.status(404).json({
         status: 'fail',
         message: 'Invalid ID'
      });
   }
   next();
};
*/

/*
exports.checkBody = (req, res, next) => {
   if (!req.body.name || !req.body.price) {
      return res.status(400).json({
         status: 'fail',
         message: 'Missing name or price'
      });
   }
   next();
};
*/

exports.getAllTours = async (req, res) => {
   try {
      // console.log(req.requestTime);
      const tours = await Tour.find();
      res.status(200).json({
         status: 'success',
         results: tours.length,
         data: {
            tours
         }
      });
   } catch (error) {
      res.status(404).json({
         status: 'fail',
         message: error
      });
   }
};

exports.getTour = async (req, res) => {
   try {
      const tour = await Tour.findById(req.params.id);
      // Tour.findOne({ _id: req.params.id })
      res.status(200).json({
         status: 'success',
         data: {
            tour
         }
      });
   } catch (error) {
      res.status(404).json({
         status: 'fail',
         message: error
      });
   }
};

exports.createTour = async (req, res) => {
   // const newTour = new Tour({});
   // newToeur.save();

   try {
      const newTour = await Tour.create(req.body);

      res.status(201).json({
         status: 'success',
         data: {
            tour: newTour
         }
      });
   } catch (err) {
      res.status(400).json({
         status: 'fail',
         message: err
      });
   }
};

exports.updateTour = async (req, res) => {
   try {
      const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
         new: true,
         runValidators: true
      });
      res.status(200).json({
         status: 'success',
         data: {
            tour // ES6: object property shorthand syntax
         }
      });
   } catch (error) {
      res.status(404).json({
         status: 'fail',
         message: error
      });
   }
};

exports.deleteTour = async (req, res) => {
   try {
      await Tour.findByIdAndDelete(req.params.id);
      res.status(204).json({
         status: 'success',
         data: null
      });
   } catch (error) {
      res.status(404).json({
         status: 'fail',
         message: error
      });
   }
};
