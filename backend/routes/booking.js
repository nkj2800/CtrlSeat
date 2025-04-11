import { cancelBooking, createBooking, getAllBookings, getBookingById, getMyBookings } from '../controllers/bookingControllers.js'
import { authoriseRoles, isAuthenticatedUser } from '../middlewares/auth.js'
import express from 'express'

const router= express.Router()

router.route('/').post(isAuthenticatedUser, createBooking)
router.route('/me').get(isAuthenticatedUser, getMyBookings)
router.route('/:id').delete(isAuthenticatedUser, cancelBooking)

router.route('/admin').get(isAuthenticatedUser, authoriseRoles('admin'), getAllBookings)
router.route('/admin/:id').get(isAuthenticatedUser, authoriseRoles('admin'), getBookingById)

export default router