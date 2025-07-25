const express = require('express');
const {
   getAllTours,
   createTour,
   getTour,
   updateTour,
   deleteTour,
   aliasTopTours,
   getTourStats,
   getMonthlyPlan
} = require('./../controllers/tourController');

const router = express.Router();

// router.param('id', checkId);
// Alias route
router.route('/top-5-cheap').get(aliasTopTours, getAllTours);

router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);

router
   .route('/')
   .get(getAllTours)
   // .post(checkBody, createTour);
   .post(createTour);

router
   .route('/:id')
   .get(getTour)
   .patch(updateTour)
   .delete(deleteTour);

module.exports = router;
