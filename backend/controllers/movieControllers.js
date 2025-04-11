import Movie from '../models/movie.js'
import catchAsyncErrors from '../middlewares/catchAsyncErrors.js'
import ErrorHandler from '../utils/errorHandler.js'


// Get all Movies: GET  /api/movies
export const getMovies = catchAsyncErrors(async (req, res, next) => {
  const movies = await Movie.find({isActive: true})

  res
    .status(200)
    .json({
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
  let movie = await Movie.findById(req?.params?.id)

  if (!movie) {
    return next(new ErrorHandler('Movie not found', 404))
  }

  movie = await Movie.findByIdAndUpdate(req?.params?.id, req.body, { new: true })

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

  await Movie.findByIdAndUpdate(req?.params?.id, {isActive: false})

  res
  .status(200)
  .json({
    success : true
  })
})