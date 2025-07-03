const express = require('express');
const {
   getAllTours,
   createTour,
   getTour,
   updateTour,
   deleteTour,
   checkId,
   checkBody,
} = require('./../controllers/tourController');
const router = express.Router();

// Create a checkBody middleware
// Check if body contains the name and price property
// If not, send back 400
// Add it to the post

router.param('id', checkId);

router.route('/').get(getAllTours).post(checkBody, createTour);

router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
