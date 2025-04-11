class APIFilters {
  constructor(query, queryStr) {
    this.query = query
    this.queryStr = queryStr
  }

  // Search by movie title (case-insensitive)
  search() {
    const keyword = this.queryStr.keyword ? { title: { $regex: this.queryStr.keyword, $options: 'i' } } : {}

    this.query = this.query.find({ ...keyword })
    return this
  }

  // Filters (language, ratings[gte])
  filters() {
    const queryCopy = { ...this.queryStr }

    // Fields to exclude
    const excludeFields = ['keyword', 'page', 'limit']
    excludeFields.forEach(param => delete queryCopy[param])

    // Filter by language (case-insensitive)
    if (queryCopy.language) {
      queryCopy.language = {
        $regex: queryCopy.language,
        $options: 'i'
      }
    }

    // Advanced numeric filters (e.g. ratings[gte]=4.5)
    let queryStr = JSON.stringify(queryCopy)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`)

    this.query = this.query.find(JSON.parse(queryStr))
    return this
  }

  // Pagination
  pagination(resultsPerPage) {
    const currentPage = Number(this.queryStr.page) || 1
    const skip = resultsPerPage * (currentPage - 1)

    this.query = this.query.limit(resultsPerPage).skip(skip)
    return this
  }
}

export default APIFilters
