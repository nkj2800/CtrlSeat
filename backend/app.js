import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import qs from 'qs'

dotenv.config({ path: './backend/config/config.env' })

import { connectDatabase } from './config/dbConnect.js'
import errorMiddleware from './middlewares/error.js'

import AuthRoutes from './routes/auth.js'
import MovieRoutes from './routes/movie.js'
import ShowRoutes from './routes/show.js'
import BookingRoutes from './routes/booking.js'
import PaymentRoutes from './routes/payment.js'

// Handle Uncaught Exceptions
process.on('uncaughtException', (err)=> {
  console.log(`Error: ${err}`)
  console.log('Shutting down due to Uncaught Exception')

  process.exit(1)
})

const app = express()

app.set('query parser', str => qs.parse(str))

app.use(express.json())
app.use(morgan('dev'))
app.use(cookieParser())


connectDatabase()

// Mount API routes
app.use('/api/auth', AuthRoutes)
app.use('/api/movies', MovieRoutes)
app.use('/api/shows', ShowRoutes)
app.use('/api/bookings', BookingRoutes)
app.use('/api/payments', PaymentRoutes)


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