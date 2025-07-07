const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace(
   '<PASSWORD>',
   process.env.DATABASE_PASSWORD
);

mongoose
   .connect(DB, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useFindAndModify: false
   })
   .then(con => {
      console.log(con.connections);
      console.log('DB connection successful!');
   });

const tourSchema = new mongoose.Schema({
   name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unquiue: true
   },
   rating: {
      type: Number,
      default: 4.5
   },
   price: {
      type: Number,
      required: [true, 'A tour must have a price']
   }
});
const Tour = mongoose.model('Tour', tourSchema);

// console.log(process.env);
const port = process.env.PORT || 3000;

app.listen(port, () => {
   console.log(`App running on port ${port}...`);
});
