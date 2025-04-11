import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Booking from "../models/booking.js";
import Show from '../models/show.js'


// Create a Booking: POST  /api/bookings
export const createBooking = catchAsyncErrors(async (req, res, next) => {
  const { showId, numberOfSeats } = req.body

  if (!showId || !numberOfSeats) {
    return next(new ErrorHandler('Show ID and number of seats are required', 400))
  }

  const show = await Show.findById(showId)
  if (!show || show.isCancelled) {
    return next(new ErrorHandler('Show not available or has been cancelled', 404))
  }

  if (new Date(show.startTime) <= new Date()) {
    return next(new ErrorHandler('Cannot book a show that already started or ended', 400))
  }

  if (show.seatsRemaining < numberOfSeats) {
    return next(new ErrorHandler('Not enough seats available', 400))
  }

  const basePrice = show.price * numberOfSeats
  const taxAmount = Math.round(basePrice * 0.18) // 18% GST
  const totalPrice = basePrice + taxAmount

  // reduce seats before creating booking
  show.seatsRemaining -= numberOfSeats
  await show.save()

  const booking = await Booking.create({
    user: req.user._id,
    show: show._id,
    numberOfSeats,
    basePrice,
    taxAmount,
    totalPrice
  })

  res
    .status(201)
    .json({
      message: 'Booking Created',
      booking
    })
})


// Get Bookings by User:  /api/bookings/me
export const getMyBookings = catchAsyncErrors(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate({
      path: 'show',
      select: 'screen startTime',
      populate: {
        path: 'movie',
        select: 'title'
      }
    })
    .sort({
      createdAt: -1
    })

  res
    .status(200)
    .json({ bookings })
})


// Cancel a Booking: DELETE  /api/bookings/:id       
export const cancelBooking = catchAsyncErrors(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id)

  if (!booking || booking.isCancelled) {
    return next(new ErrorHandler('Booking not found or already cancelled', 404))
  }

  const show = await Show.findById(booking.show)
  if (show) {
    const threeHoursBeforeShow = new Date(show.startTime.getTime() - 3 * 60 * 60 * 1000)

    if (new Date() > threeHoursBeforeShow) {
      return next(new ErrorHandler('Cancellations are only allowed up to 3 hours before the showtime', 400))
    }
  }

  // restore seats
  if (show) {
    show.seatsRemaining += booking.numberOfSeats
    await show.save()
  }

  booking.isCancelled = true
  await booking.save()

  res
    .status(200)
    .json({ message: 'Booking cancelled successfully' })
})