import Razorpay from 'razorpay'
import dotenv from 'dotenv'
dotenv.config({ path: './backend/config/config.env' }) // make sure this path is correct

const keyId = process.env.RAZORPAY_KEY_ID
const keySecret = process.env.RAZORPAY_KEY_SECRET

if (!keyId || !keySecret) {
  throw new Error('Razorpay key_id or key_secret is missing from environment variables')
}

const razorpay = new Razorpay({
  key_id: keyId,
  key_secret: keySecret
})

export default razorpay