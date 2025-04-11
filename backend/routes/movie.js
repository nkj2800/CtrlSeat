import { createMovie, deleteMovie, getMovieDetails, getMovies, getMovieShows, updateMovieDetails } from '../controllers/movieControllers.js'
import { authoriseRoles, isAuthenticatedUser } from '../middlewares/auth.js'
import express from 'express'

const router = express.Router()


router.route('/').get(getMovies)
router.route('/:id').get(getMovieDetails)
router.route('/:id/shows').get(getMovieShows)

router.route('/').post(isAuthenticatedUser, authoriseRoles('admin'), createMovie)
router.route('/:id')
  .put(isAuthenticatedUser, authoriseRoles('admin'), updateMovieDetails)
  .delete(isAuthenticatedUser, authoriseRoles('admin'), deleteMovie)


export default router