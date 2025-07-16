const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema(
   {
      name: {
         type: String,
         required: [true, 'A tour must have a name'],
         unique: true,
         trim: true
      },
      duration: {
         type: Number,
         required: [true, 'A tour must have a duration']
      },
      maxGroupSize: {
         type: Number,
         required: [true, 'A tour must have a group size']
      },
      difficulty: {
         type: String,
         required: [true, 'A tour must have a difficulty']
      },
      ratingsAverage: {
         type: Number,
         default: 4.5
      },
      ratingsQuantity: {
         type: Number,
         default: 0
      },
      price: {
         type: Number,
         required: [true, 'A tour must have a price']
      },
      priceDiscount: Number,
      summary: {
         type: String,
         trim: true,
         required: [true, 'A tour must have a summery']
      },
      description: {
         type: String,
         trim: true
      },
      imageCover: {
         type: String,
         required: [true, 'A tour must have a cover image']
      },
      images: [String],
      createAt: {
         type: Date,
         default: Date.now(),
         select: false // Hide crateAt field from client
      },
      startDates: [Date]
   },
   {
      toJSON: { virtuals: true },
      toObject: { virtuals: true } // Include virtuals in JSON output
   }
);

// Use normal function to get this keyword, arrow function would not work here
tourSchema.virtual('durationWeeks').get(function() {
   return this.duration / 7;
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
