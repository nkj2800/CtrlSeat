import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

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

export default mongoose.model('User', userSchema)