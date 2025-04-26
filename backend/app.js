import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import qs from 'qs'
import { rateLimit } from 'express-rate-limit'
import helmet from 'helmet'
import { xss } from 'express-xss-sanitizer'
import hpp from 'hpp'

dotenv.config({ path: './backend/config/config.env' })

import { connectDatabase } from './config/dbConnect.js'
import errorMiddleware from './middlewares/error.js'

import AuthRoutes from './routes/auth.js'
import MovieRoutes from './routes/movie.js'
import ShowRoutes from './routes/show.js'
import BookingRoutes from './routes/booking.js'
import PaymentRoutes from './routes/payment.js'
import ErrorHandler from './utils/errorHandler.js'


// Handle Uncaught Exceptions
process.on('uncaughtException', (err) => {
  console.log(`Error: ${err}`)
  console.log('Shutting down due to Uncaught Exception')

  process.exit(1)
})

const app = express()

app.use(morgan('dev')) // Logging

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
})

// Enable trust proxy to properly handle client IP addresses behind a reverse proxy (required for express-rate-limit on hosting platforms like Render)
app.set('trust proxy', 1);

app.use('/api', limiter)
app.use(helmet()) // Security headers

app.set('query parser', str => qs.parse(str))

app.use(express.json())
app.use(xss()) // Sanitize data
app.use(hpp()) // Prevent HTTP Parameter Pollution
app.use(cookieParser())

connectDatabase()

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to CtrlSeat API',
    description: 'Book Your Movie ticket with CtrlSeat',
    apiVersion: '1.0.0',
    endpoints: {
      movies: '/api/movies',
      shows: '/api/shows',
      users: '/api/users',
      bookings: '/api/bookings'
    }
  });
})

// Mount API routes
app.use('/api/auth', AuthRoutes)
app.use('/api/movies', MovieRoutes)
app.use('/api/shows', ShowRoutes)
app.use('/api/bookings', BookingRoutes)
app.use('/api/payments', PaymentRoutes)

// Handle default route
app.use((req, res, next) => {
  return next(new ErrorHandler(`Route not found: ${req.originalUrl}`, 404))
})

app.use(errorMiddleware)

const server = app.listen(process.env.PORT, () => {
  console.log(`Server listening on PORT ${process.env.PORT} in ${process.env.NODE_ENV} mode`)
})

// Handle Unhandled Promise Rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err}`)
  console.log('Shutting down server due to Unhandled Promise Rejection');

  server.close(() => {
    process.exit(1)
  })
}) 