import mongoose from 'mongoose'

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please enter the movie title'],
  },
  description: {
    type: String,
    required: [true, 'Please enter the movie description']
  },
  genre: {
    type: [String],
    default: []
  },
  language: {
    type: String,
    required: [true, 'Please specify the movie language']
  },
  duration: {
    type: Number,
    required: [true, 'Please enter the movie duration in minutes']
  },
  releaseDate: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  ratings: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

export default mongoose.model('Movie', movieSchema)
