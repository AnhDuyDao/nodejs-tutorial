const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema(
   {
      name: {
         type: String,
         required: [true, 'A tour must have a name'],
         unique: true,
         trim: true,
         maxlength: [
            40,
            'A tour name must have less or equal than 40 characters'
         ],
         minlength: [
            10,
            'A tour name must have more or equal than 10 characters'
         ]
         // validate: [validator.isAlpha, 'Tour name must only contain characters']
         // Do not use () here, it is a reference to the function to mongoose run it later
      },
      slug: String,
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
         required: [true, 'A tour must have a difficulty'],
         enum: {
            // Validate for string values
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is either: easy, medium, or difficult'
         } // Validate against these values
      },
      ratingsAverage: {
         type: Number,
         default: 4.5,
         min: [1, 'Rating must be above 1.0'],
         max: [5, 'Rating must be below 5.0']
      },
      ratingsQuantity: {
         type: Number,
         default: 0
      },
      price: {
         type: Number,
         required: [true, 'A tour must have a price']
      },
      priceDiscount: {
         type: Number,
         validate: {
            validator: function(val) {
               // This only points to current doc on NEW document creation
               // Not on update
               return val < this.price;
            },
            message: 'Discount price ({VALUE}) should be below regular price'
         }
      },
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
      startDates: [Date],
      secretTour: {
         type: Boolean,
         default: false
      }
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

// Document middleware: runs before .save() and .create()
tourSchema.pre('save', function(next) {
   this.slug = slugify(this.name, { lower: true });
   next();
});

// tourSchema.pre('save', function(next) {
//    console.log('Will save document...');
//    next();
// });

// tourSchema.post('save', function(doc, next) {
//    console.log(doc);
//    next();
// });

// Query middleware: runs before .find() and other query methods
//tourSchema.pre('find', function(next) {
tourSchema.pre(/^find/, function(next) {
   this.find({ secretTour: { $ne: true } }); // Exclude secret tours
   this.start = Date.now();
   next();
});

tourSchema.post(/^find/, function(docs, next) {
   console.log(`Query took ${Date.now() - this.start} milliseconds!`);
   next();
});

// Aggregation middleware
tourSchema.pre('aggregate', function(next) {
   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } }); // Exclude secret tours
   console.log(this.pipeline());
   next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
