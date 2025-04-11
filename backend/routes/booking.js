import { cancelBooking, createBooking, getMyBookings } from '../controllers/bookingControllers.js'
import { isAuthenticatedUser } from '../middlewares/auth.js'
import express from 'express'

const router= express.Router()

router.route('/').post(isAuthenticatedUser, createBooking)
router.route('/me').get(isAuthenticatedUser, getMyBookings)
router.route('/:id').delete(isAuthenticatedUser, cancelBooking)

export default router