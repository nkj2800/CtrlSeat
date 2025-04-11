import User from "../models/user.js";
import catchAsyncErrors from "./catchAsyncErrors.js";
import jwt from 'jsonwebtoken'
import ErrorHandler from "../utils/errorHandler.js";


// checks if the user is Authenticated
export const isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies

  if (!token) {
    return next(new ErrorHandler('Login first to access this resource', 401))
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET)

  if (!decoded || !decoded.id) {
    return next(new ErrorHandler('Invalid token. Please log in again.', 401));
  }

  req.user = await User.findById(decoded.id)

  next()
})

// Authorise user roles
export const authoriseRoles = (...roles) => {
  return (req, res, next) => {
    if(!roles.includes(req.user.role)) {
      return next(new ErrorHandler(`'${req.user.role}' is not allowed to access this resource`, 403))
    }

    next()
  }
}
