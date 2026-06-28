

'use strict';

class QueryBuilder {
  /**
   * @param {import('mongoose').Query} query - Mongoose query object
   * @param {object} queryString - Request query params (req.query)
   */
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  /**
   * Filters query based on field equality and comparison operators
   * Excludes reserved query params: page, sort, limit, fields, search
   *
   * @returns {QueryBuilder} this (for chaining)
   */
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Convert comparison operators (gte, gt, lte, lt) to MongoDB operators starting with $
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let finalQueryObj = JSON.parse(queryStr);

    // Support comma-separated tags filter or tag array filter
    if (finalQueryObj.tags) {
      if (typeof finalQueryObj.tags === 'string') {
        const tagList = finalQueryObj.tags.split(',').map(tag => tag.trim().toLowerCase());
        finalQueryObj.tags = { $in: tagList };
      } else if (Array.isArray(finalQueryObj.tags)) {
        finalQueryObj.tags = { $in: finalQueryObj.tags.map(tag => tag.toLowerCase()) };
      }
    }

    this.query = this.query.find(finalQueryObj);
    return this;
  }

  /**
   * Performs a case-insensitive regex search on title and description fields
   *
   * @returns {QueryBuilder} this (for chaining)
   */
  search() {
    if (this.queryString.search) {
      const searchRegex = new RegExp(this.queryString.search, 'i');
      this.query = this.query.find({
        $or: [
          { title: { $regex: searchRegex } },
          { description: { $regex: searchRegex } }
        ]
      });
    }
    return this;
  }

  /**
   * Applies sorting based on 'sort' query param.
   * Defaults to sorting by createdAt descending.
   *
   * @returns {QueryBuilder} this (for chaining)
   */
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  /**
   * Limits the returned fields based on 'fields' query param.
   *
   * @returns {QueryBuilder} this (for chaining)
   */
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  /**
   * Applies pagination based on 'page' and 'limit' query params.
   * Defaults: page=1, limit=10
   *
   * @returns {QueryBuilder} this (for chaining)
   */
  paginate() {
    const page = parseInt(this.queryString.page, 10) || 1;
    const limit = parseInt(this.queryString.limit, 10) || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }

  /**
   * Returns the total count of documents matching the current filter
   * (without pagination applied).
   *
   * @returns {Promise<number>}
   */
  async countTotal() {
    const model = this.query.model;
    const filterConditions = this.query.getFilter();
    return await model.countDocuments(filterConditions);
  }
}

module.exports = QueryBuilder;

