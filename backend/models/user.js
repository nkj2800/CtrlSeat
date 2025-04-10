import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter your Name'],
      maxLength: [50, 'Your name cannot exceed 50 Characters']
    },
    email: {
      type: String,
      required: [true, 'Please enter your email'],
      unique: true
    },
    password: {
      type: String,
      required: [true, 'Pleasa enter your password'],
      minLength: [6, 'Your password must have atleast 6 Characters'],
      select: false
    },
    role: {
      type: String,
      default: 'user'
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    resetPasswordToken: String,
    resetPasswordTokenExpired: Date
  },
  {
    timestamps: true
  }
)

// encrpting password before saving the user
userSchema.pre('save', async function(next) {
  if(!this.isModified('password')) {
    next()
  }   
  
  this.password= await bcrypt.hash(this.password, 10)
})

// return JWT Token
userSchema.methods.getJwtToken = function () {
  return jwt.sign(
    {
      id: this._id
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN
    }
  )
}

// compare Password with HashedPassword
userSchema.methods.comparePassword= async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

export default mongoose.model('User', userSchema)