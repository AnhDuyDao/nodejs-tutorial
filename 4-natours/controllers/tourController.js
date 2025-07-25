const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');

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
      const features = new APIFeatures(Tour.find(), req.query)
         .filter()
         .sort()
         .limitFields()
         .paginate();
      // Execute query
      const tours = await features.query;

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

exports.getTourStats = async (req, res) => {
   try {
      const stats = await Tour.aggregate([
         {
            $match: { ratingsAverage: { $gte: 4.5 } }
         },
         {
            $group: {
               _id: { $toUpper: '$difficulty' },
               numTours: { $sum: 1 },
               numRatings: { $sum: '$ratingsQuantity' },
               avgRating: { $avg: '$ratingsAverage' },
               avgPrice: { $avg: '$price' },
               minPrice: { $min: '$price' },
               maxPrice: { $max: '$price' }
            }
         },
         {
            $sort: { avgPrice: 1 } // 1 for ascending, -1 for descending
         }
         // {
         //    $match: { _id: { $ne: 'EASY' } } // $ne: not equal EASY
         // }
      ]);

      res.status(200).json({
         status: 'success',
         data: {
            stats
         }
      });
   } catch (error) {
      res.status(404).json({
         status: 'fail',
         message: error
      });
   }
};

exports.getMonthlyPlan = async (req, res) => {
   try {
      const year = req.params.year * 1; // Convert string to number
      const plan = await Tour.aggregate([
         {
            $unwind: '$startDates' // Deconstructs the startDates array field from the input documents to output a document for each element
         },
         {
            $match: {
               startDates: {
                  $gte: new Date(`${year}-01-01`),
                  $lte: new Date(`${year}-12-31`)
               }
            }
         },
         {
            $group: {
               _id: { $month: '$startDates' }, // Group by month
               numToursStarts: { $sum: 1 }, // Count the number of tours starting in that month
               tours: { $push: '$name' } // Push the tour name into an array
            }
         },
         {
            $addFields: { month: '$_id' } // Add a new field 'month' with the value of '_id'
         },
         {
            $project: {
               _id: 0 // Exclude the _id field from the output
            }
         },
         {
            $sort: { numToursStarts: -1 } // Sort by number of tours starting in descending order
         },
         {
            $limit: 12 // Limit the results to 12 months
         }
      ]);

      res.status(200).json({
         status: 'success',
         data: {
            plan
         }
      });
   } catch (error) {
      res.status(404).json({
         status: 'fail',
         message: error
      });
   }
};
