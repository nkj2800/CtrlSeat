import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import User from "../models/user.js";
import sendToken from "../utils/sendToken.js";
import ErrorHandler from "../utils/errorhandler.js";
import crypto from 'crypto'
import sendEmail from "../utils/sendEmail.js";
import { getResetPasswordTemplate } from "../utils/emailTemplates.js";


// Register a User: POST  /api/auth/register
export const registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body

  const user = await User.create({
    name,
    email,
    password
  })

  sendToken(user, 201, res)
})


// Login User: POST  /api/auth/login
export const loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body

  if(!email || !password) {
    return next(new ErrorHandler('Please enter email & password', 400))
  }

  const user= await User.findOne({email}).select('+password')

  if(!user) {
    return next(new ErrorHandler('Invalid email & password', 401))
  }

  const isPasswordMatched= await user.comparePassword(password)

  if(!isPasswordMatched) {
    return next(new ErrorHandler('Invalid email & password', 401))
  }

  sendToken(user, 200, res)
})


// Logout User: GET  /api/auth/login
export const logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true
  })

  res
    .status(200)
    .json({
      message: 'Logged Out'
    })
})


// Forgot Password: POST  /api/auth/password/forgot
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {

  // find user in the database
  const user = await User.findOne({ email: req.body.email })

  if (!user) {
    return next(new ErrorHandler('User not found with this email', 404))
  }

  // get reset password token
  const resetToken = user.getResetPasswordToken()

  // new values are added on the schema(resetPasswordToken, resetPasswordTokenExpired)
  await user.save()

  // create reset password url
  const resetUrl = `http://localhost:3000/api/auth/password/reset/${resetToken}`

  const message = getResetPasswordTemplate(user?.name, resetUrl)

  try {

    await sendEmail({
      email: user.email,
      subject: 'CtrlSeat password Recovery',
      message
    })

    res
      .status(200)
      .json({
        message: `Email sent to ${user.email}`
      })

  } catch (error) {
    user.resetPasswordToken = undefined
    user.resetPasswordTokenExpire = undefined

    await user.save()

    return next(error?.message, 500)
  }
})


// Reset Password: PUT  /api/auth/password/reset/:token
export const resetPassword = catchAsyncErrors(async (req, res, next) => {

  // Hash the url token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex')

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordTokenExpire: { $gt: Date.now() }
  })

  if (!user) {
    return next(new ErrorHandler('Password reset token is Invalid or has been Expired', 400))
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler('Passwords does not match', 400))
  }

  // Set new password
  user.password = req.body.password

  user.resetPasswordToken = undefined
  user.resetPasswordTokenExpire = undefined

  await user.save()

  sendToken(user, 200, res)
})