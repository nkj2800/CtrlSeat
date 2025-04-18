// backend/middlewares/validators.js
import { check, validationResult } from 'express-validator';

export const validateRegistration = [
  check('name')
    .notEmpty()
    .withMessage('Please enter your name')
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters'),
  
  check('email')
    .notEmpty()
    .withMessage('Please enter your email')
    .isEmail()
    .withMessage('Please enter a valid email address'),
  
  check('password')
    .notEmpty()
    .withMessage('Please enter a password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map(error => ({ 
          field: error.param,
          message: error.msg
        }))
      });
    }
    
    next();
  }
];

export const validateLogin = [
  check('email')
    .notEmpty()
    .withMessage('Please enter your email')
    .isEmail()
    .withMessage('Please enter a valid email address'),

  check('password')
    .notEmpty()
    .withMessage('Please enter your password'),

  (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map(error => ({
          field: error.param,
          message: error.msg
        }))
      });
    }
    
    next();
  }
];