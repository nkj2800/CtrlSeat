import { createShow, deleteShow, getShowDetails, getShows, updateShowDetails } from '../controllers/showControllers.js'
import { authoriseRoles, isAuthenticatedUser } from '../middlewares/auth.js'
import express from 'express'

const router = express.Router()

router.route('/')
  .get(getShows)
  .post(isAuthenticatedUser, authoriseRoles('admin'), createShow)

router.route('/:id')
  .get(getShowDetails)
  .put(isAuthenticatedUser, authoriseRoles('admin'), updateShowDetails)
  .delete(isAuthenticatedUser, authoriseRoles('admin'), deleteShow)

export default router