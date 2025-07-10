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

// Prefilling query so that the user doesn't have to do it
exports.aliasTopTours = (req, res, next) => {
   req.query.limit = '5';
   req.query.sort = '-ratingsAverage,price';
   req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
   next();
};

exports.getAllTours = async (req, res) => {
   try {
      console.log(req.query);
      // Build query
      // 1A) Filtering
      const queryObj = { ...req.query }; // Copy using
      const excludeFields = ['page', 'sort', 'limit', 'fields'];
      excludeFields.forEach(el => delete queryObj[el]);

      // 1B) Advanced filtering
      // { difficulty: 'easy', duration: { $gte: 5 } }
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
      // console.log(req.requestTime);
      // Way 1:
      let query = Tour.find(JSON.parse(queryStr));
      // Way 2: Chaining mongoose methods
      // const query = Tour.find()
      //    .where('duration')
      //    .equals(5)
      //    .where('difficulty')
      //    .equals('easy');

      // 2) Sorting
      if (req.query.sort) {
         const sortBy = req.query.sort.split(',').join(' ');
         query = query.sort(sortBy);
         // sort('price ratingsAverage')
      } else {
         query = query.sort('_id');
      }

      // 3) Field limiting
      if (req.query.fields) {
         const fields = req.query.fields.split(',').join(' ');
         query = query.select(fields);
      } else {
         query = query.select('-__v'); // Exclude __v field
      }

      // 4) Pagination
      // page=2&limit=10 1-10 page 1, 11-20 page 2, 21-30 page 3
      const page = req.query.page * 1 || 1;
      const limit = req.query.limit * 1 || 100;
      const skip = (page - 1) * limit;

      query = query.skip(skip).limit(limit);

      if (req.query.page) {
         const numTours = await Tour.countDocuments();
         if (skip >= numTours) {
            throw new Error('This page does not exist');
         }
      }

      // Execute query
      const tours = await query;

      // Send response
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
