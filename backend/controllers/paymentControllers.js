import razorpay from '../utils/razorpay.js'
import Booking from '../models/booking.js'
import catchAsyncErrors from '../middlewares/catchAsyncErrors.js'
import ErrorHandler from '../utils/errorHandler.js'
import crypto from 'crypto'
import User from '../models/user.js'
import Show from '../models/show.js'
import sendEmail from "../utils/sendEmail.js";
import { getBookingConfirmationTemplate } from "../utils/emailTemplates.js";


// Create Razorpay Order for a Booking: POST  api/payments/order
export const createRazorpayOrder = catchAsyncErrors(async (req, res, next) => {
  const { bookingId } = req.body

  if (!bookingId) {
    return next(new ErrorHandler('Booking ID is required', 400))
  }

  const booking = await Booking.findById(bookingId)

  if (!booking || booking.isCancelled) {
    return next(new ErrorHandler('Booking not found or already cancelled', 404))
  }

  if (booking.paymentStatus === 'paid') {
    return next(new ErrorHandler('Booking is already paid', 400))
  }

  const options = {
    amount: booking.totalPrice , 
    currency: 'INR',
    receipt: `receipt_${booking._id}`,
    notes: {
      bookingId: booking._id.toString(),
      userId: req.user._id.toString()
    }
  }

  const order = await razorpay.orders.create(options)

  res.status(200).json({
    order,
    success: true,
    orderId: order.id,
    amount: order.amount,
    currency: order.currency
  })
})


// Verify Razorpay Payment Signature: POST  api/payments/verify
export const verifyRazorpayPayment = catchAsyncErrors(async (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !bookingId) {
    return next(new ErrorHandler('Missing payment verification details', 400))
  }

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex')

  if (expectedSignature !== razorpay_signature) {
    return next(new ErrorHandler('Payment verification failed', 400))
  }

  const booking = await Booking.findById(bookingId).populate({
    path: 'show',
    populate: {
      path: 'movie',
      select: 'title'
    }
  });

  if (!booking) {
    return next(new ErrorHandler('Booking not found', 404))
  }

  booking.paymentStatus = 'paid';
  booking.paymentIntentId = razorpay_payment_id;
  await booking.save();

  // Fetch user info
  const user = await User.findById(booking.user);
  if (!user) {
    return next(new ErrorHandler('User not found for this booking', 404));
  }

  // Compose and send confirmation email
  const emailHtml = getBookingConfirmationTemplate({
    name: user.name,
    bookingId: booking._id,
    movieTitle: booking.show.movie.title,
    screen: booking.show.screen,
    showtime: booking.show.startTime,
    numberOfSeats: booking.numberOfSeats,
    totalPrice: (booking.totalPrice / 100).toFixed(2)  // convert back to ₹ if stored in paise
  });

  await sendEmail({
    email: user.email,
    subject: '🎟️ CtrlSeat Booking Confirmation',
    message: emailHtml
  });

  res.status(200).json({
    success: true,
    message: 'Payment verified and booking confirmed. Email sent.'
  });
})
