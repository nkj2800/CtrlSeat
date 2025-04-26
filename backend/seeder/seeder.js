import mongoose from 'mongoose'
import movies from './data.js'
import Movie from '../models/movie.js'
import dotenv from 'dotenv'

dotenv.config({path: 'backend/config/config.env'})


const seedMovies = async () => {
  try {

    mongoose.connect(process.env.DB_URI)

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