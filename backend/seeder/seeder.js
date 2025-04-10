import mongoose from 'mongoose'
import movies from './data.js'
import Movie from '../models/movie.js'

const seedMovies = async () => {
  try {

    mongoose.connect('mongodb://localhost:27017/ctrlseat')

    await Movie.deleteMany()
    console.log('Movies are clered from database')

    await Movie.insertMany(movies)
    console.log('Movies are inserted into database')

    process.exit()
  } catch (error) {
    console.log(error.message)

    process.exit()
  }
}

seedMovies()