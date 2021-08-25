const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../app/models/User')

const auth = asyncHandler(async (req, res, next) => {
  let token = req.headers.authorization

  if (token && token.startsWith('Bearer')) {
    try {
      token = token.split(' ')[1]

      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      req.user = await User.findById(decoded.id).select('-password')

      next()
    } catch (err) {
      res.status(401)
      throw new Error('Token is not valid')
    }
  } else {
    res.status(401)
    throw new Error('Access denied')
  }
})

module.exports = auth
