class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};

    //console.log(this.queryStr);

    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    let queryCopy = { ...this.queryStr };
    const removeField = ["keyword", "page", "limit"];
    removeField.forEach((field) => {
      delete queryCopy[field];
    });

    // filter for price and rating
    //console.log(queryCopy);
    let queryStr = JSON.stringify(queryCopy);
    //console.log(queryStr);

    //adding $ in front of every operator for mongodb fiter  greater than $gt ,etc
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
    queryStr = JSON.parse(queryStr);
    this.query = this.query.find(queryStr);
    //console.log(queryStr);
    return this;
  }

  //pagination
  pagination(productPerPage) {
    const current_Page = this.queryStr.page || 1;
    const skipProduct = productPerPage * (current_Page - 1);
    this.query = this.query.limit(productPerPage).skip(skipProduct);
    return this;
  }
}

module.exports = ApiFeatures;
