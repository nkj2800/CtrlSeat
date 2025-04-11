import mongoose from 'mongoose'

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  show: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Show',
    required: true
  },
  numberOfSeats: {
    type: Number,
    required: true,
    min: [1, 'At least 1 seat must be booked']
  },
  basePrice: {
    type: Number,
    required: true
  },
  taxAmount: {
    type: Number,
    required: true,
    default: 0
  },
  totalPrice: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  paymentIntentId: {
    type: String // for Stripe integration
  },
  isCancelled: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

export default mongoose.model('Booking', bookingSchema)
