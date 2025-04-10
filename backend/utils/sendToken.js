// Create Token and save in the Cookie
export default (user, statusCode, res) => {
  // create JWT token
  const token = user.getJwtToken()

  // cookie options
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      token
    })
}