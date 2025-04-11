import Show from '../models/show.js'
import ErrorHandler from '../utils/errorHandler.js'
import catchAsyncErrors from '../middlewares/catchAsyncErrors.js'



// Get all Shows: GET  /api/shows
export const getShows = catchAsyncErrors(async (req, res, next) => {
  const shows = await Show.find({ isCancelled: false }).populate('movie', 'title language duration')

  res
    .status(200)
    .json({
      shows
    })
})


// Get Show Details: GET  /api/shows/:id
export const getShowDetails = catchAsyncErrors(async (req, res, next) => {
  const show = await Show.findById(req?.params?.id).populate('movie', 'title description genre language duration releaseDate ratings')

  if (!show) {
    return next(new ErrorHandler('Show not found', 404))
  }

  res
    .status(200)
    .json({
      show
    })
})


// Create a Show - ADMIN:  POST  /api/shows
export const createShow = catchAsyncErrors(async (req, res, next) => {
  req.body.createdBy = req.user._id

  if (req.body.seatsRemaining > req.body.totalSeats) {
    return next(new ErrorHandler('Seats remaining cannot exceed total seats', 400))
  }

  const show = await Show.create(req.body)

  res
    .status(201)
    .json({
      show
    })
})


// Update Show - ADMIN: PUT  /api/shows/:id
export const updateShowDetails = catchAsyncErrors(async (req, res, next) => {
  let show = await Show.findById(req?.params?.id)

  if (!show) {
    return next(new ErrorHandler('Show not found', 404))
  }

// Prevent mutation of sensitive fields like movie or createdBy
  const allowedFields = ['screen', 'startTime', 'price', 'totalSeats', 'seatsRemaining']

  const updates = {}
  for (const key of allowedFields) {
    if (req.body[key] !== undefined) {
      updates[key] = req.body[key]
    }
  }

  if (updates.seatsRemaining > updates.totalSeats) {
    return next(new ErrorHandler('Seats remaining cannot exceed total seats', 400))
  }

  show = await Show.findByIdAndUpdate(req?.params?.id, updates, { new: true })

  res
    .status(200)
    .json({
      show
    })
})


// Delete Show - ADMIN: DELETE  /api/shows/:id
export const deleteShow = catchAsyncErrors(async (req, res, next) => {
  const show = await Show.findById(req?.params?.id)

  if (!show) {
    return next(new ErrorHandler('Show not found', 404))
  }

  await Show.findByIdAndUpdate(req?.params?.id, { isCancelled: true })

  res
    .status(200)
    .json({
      success: true
    })
})