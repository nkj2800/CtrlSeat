export default (err, req, res, next) => {
  let error = {
    statusCode: err?.statusCode || 500,
    message: err?.message || 'Internal Server Error'
  }

  // handle Invalid MongoDB ObjectId errors (e.g., malformed IDs in requests)
  if (err.name === 'CastError') {
    const message = `Resource not found. Invalid: ${err?.path}`

    error = new ErrorHandler(message, 400)
  }

  // handle Mongoose validation errors (e.g., required fields missing or invalid values)
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(value => value.message)

    error = new ErrorHandler(message, 400)
  }

  // handle Duplicate Key errors (e.g. email already exists)
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`

    error = new ErrorHandler(message, 400)
  }

  // handle wrong JWT error
  if (err.name === 'JsonWebTokenError') {
    const message = `Jwt Token is Invalid. Try again!`

    error = new ErrorHandler(message, 400)
  }

  // handle expired JWT error
  if (err.name === 'TokenExpiredError') {
    const message = `Jwt Token has Expired. Login again!`

    error = new ErrorHandler(message, 400)
  }

  if (process.env.NODE_ENV === 'PRODUCTION') {
    res
      .status(error.statusCode)
      .json({
        message: error.message
      })
  }

  if (process.env.NODE_ENV === 'DEVELOPMENT') {
    res
      .status(error.statusCode)
      .json({
        message: error.message,
        error: err,
        stack: err?.stack
      })
  }
}