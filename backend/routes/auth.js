import express from 'express'
import { allUsers, deleteUser, forgotPassword, getUserDetails, getUserProfile, loginUser, logoutUser, registerUser, resetPassword, updatePassword, updateProfile, updateUser } from '../controllers/authControllers.js'
import { authoriseRoles, isAuthenticatedUser } from '../middlewares/auth.js'
import { validateRegistration, validateLogin } from '../middlewares/validator.js'

const router = express.Router()

router.route('/register').post(validateRegistration, registerUser)
router.route('/login').post(validateLogin, loginUser)
router.route('/logout').get(logoutUser)

router.route('/password/forgot').post(forgotPassword)
router.route('/password/reset/:token').put(resetPassword)

router.route('/me').get(isAuthenticatedUser, getUserProfile)
router.route('/me/update').put(isAuthenticatedUser, updateProfile)
router.route('/password/update').put(isAuthenticatedUser, updatePassword)

router.route('/admin/users').get(isAuthenticatedUser, authoriseRoles('admin'), allUsers)
router.route('/admin/users/:id')
  .get(isAuthenticatedUser, authoriseRoles('admin'), getUserDetails)
  .put(isAuthenticatedUser, authoriseRoles('admin'), updateUser)
  .delete(isAuthenticatedUser, authoriseRoles('admin'), deleteUser)


export default router