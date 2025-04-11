import express from 'express'
import { isAuthenticatedUser } from '../middlewares/auth.js'
import { createRazorpayOrder, verifyRazorpayPayment } from '../controllers/paymentControllers.js'

const router = express.Router()

// Create Razorpay order for a booking
router.route('/order').post(isAuthenticatedUser, createRazorpayOrder)

// Verify Razorpay payment after frontend returns success
router.route('/verify').post(isAuthenticatedUser, verifyRazorpayPayment)

export default router
