import mongoose from 'mongoose'

const ShowSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  screen: {
    type: String,
    required: [true, 'Please specify the screen name or number']
  },
  startTime: {
    type: Date,
    required: [true, 'Please specify the start time of the show']
  },
  price: {
    type: Number,
    required: [true, 'Please set a ticket price']
  },
  currency: {
    type: String,
    default: 'INR'
  },
  totalSeats: {
    type: Number,
    required: [true, 'Please specify total seat capacity']
  },
  seatsRemaining: {
    type: Number,
    required: [true, 'Please specify how many seats are available']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isCancelled: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

export default mongoose.model('Show', ShowSchema)
