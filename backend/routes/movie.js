import { createMovie, deleteMovie, getMovieDetails, getMovies, updateMovieDetails } from '../controllers/movieControllers.js'
import { authoriseRoles, isAuthenticatedUser } from '../middlewares/auth.js'
import express from 'express'

const router = express.Router()


router.route('/')
  .get(getMovies)
  .post(isAuthenticatedUser, authoriseRoles('admin'), createMovie)
router.route('/:id')
  .get(getMovieDetails)
  .put(isAuthenticatedUser, authoriseRoles('admin'), updateMovieDetails)
  .delete(isAuthenticatedUser, authoriseRoles('admin'), deleteMovie)


export default router