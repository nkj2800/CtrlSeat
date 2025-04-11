import Movie from '../models/movie.js'
import Show from '../models/show.js'
import catchAsyncErrors from '../middlewares/catchAsyncErrors.js'
import ErrorHandler from '../utils/errorHandler.js'
import APIFilters from '../utils/apiFilters.js'


// Get all Movies: GET  /api/movies
export const getMovies = catchAsyncErrors(async (req, res, next) => {
  const resPerPage = 10
  const apiFilters = new APIFilters(Movie.find({ isActive: true }), req.query)
    .search()
    .filters()

  // Execute query without pagination to get total filtered count
  let movies = await apiFilters.query
  const filteredMoviesCount = movies.length

  // Apply pagination now
  apiFilters.pagination(resPerPage)
  movies = await apiFilters.query.clone()

  res.status(200).json({
    resPerPage,
    filteredMoviesCount,
    movies
  })
})


// Get Movie Details: GET  /api/movies/:id
export const getMovieDetails = catchAsyncErrors(async (req, res, next) => {
  const movie = await Movie.findById(req?.params?.id)

  if (!movie) {
    return next(new ErrorHandler('Movie not found', 404))
  }

  res
    .status(200)
    .json({
      movie
    })
})


// Get Upcoming shows for a movie: GET  /api/movies/:id/shows
export const getMovieShows = catchAsyncErrors(async (req, res, next) => {
  const movieId = req.params.id

  const shows = await Show.find({
    movie: movieId,
    isCancelled: false,
    startTime: { $gte: new Date() }
  })
    .sort({ startTime: 1 })
    .select('screen startTime price seatsRemaining')
    .populate('movie', 'title language duration')

  if (!shows || shows.length === 0) {
    return next(new ErrorHandler('No upcoming shows found for this movie', 404))
  }

  res
    .status(200)
    .json({ shows })
})



// Create a Movie - ADMIN:  POST  /api/movies
export const createMovie = catchAsyncErrors(async (req, res, next) => {
  const movie = await Movie.create(req.body)

  res
    .status(201)
    .json({
      movie
    })
})


// Update Movie - ADMIN: PUT  /api/movies/:id
export const updateMovieDetails = catchAsyncErrors(async (req, res, next) => {
  const movie = await Movie.findByIdAndUpdate(req?.params?.id, req.body, { new: true })

  if (!movie) {
    return next(new ErrorHandler('Movie not found', 404))
  }

  res
    .status(200)
    .json({
      movie
    })
})


// Delete Movie - ADMIN: DELETE  /api/movies/:id
export const deleteMovie = catchAsyncErrors(async (req, res, next) => {
  const movie = await Movie.findById(req?.params?.id)

  if (!movie) {
    return next(new ErrorHandler('Movie not found', 404))
  }

  await Movie.findByIdAndUpdate(req?.params?.id, { isActive: false })

  res
    .status(200)
    .json({
      success: true
    })
})