class APIFeatures {
   constructor(query, queryString) {
      this.query = query;
      this.queryString = queryString;
   }

   filter() {
      // 1A) Filtering
      const queryObj = { ...this.queryString }; // Copy using spread operatorall
      const excludeFields = ['page', 'sort', 'limit', 'fields'];
      excludeFields.forEach(el => delete queryObj[el]);
      // 1B) Advanced filtering
      // { difficulty: 'easy', duration: { $gte: 5 } }
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

      this.query = this.query.find(JSON.parse(queryStr));
      return this;
   }

   sort() {
      if (this.queryString.sort) {
         const sortBy = this.queryString.sort.split(',').join(' ');
         this.query = this.query.sort(sortBy);
         // sort('price ratingsAverage')
      } else {
         this.query = this.query.sort('_id');
      }
      return this;
   }

   limitFields() {
      if (this.queryString.fields) {
         const fields = this.queryString.fields.split(',').join(' ');
         this.query = this.query.select(fields);
      } else {
         this.query = this.query.select('-__v'); // Exclude __v field
      }
      return this;
   }

   paginate() {
      const page = this.queryString.page * 1 || 1;
      const limit = this.queryString.limit * 1 || 100;
      const skip = (page - 1) * limit;

      this.query = this.query.skip(skip).limit(limit);
      return this;
   }
}
module.exports = APIFeatures;
