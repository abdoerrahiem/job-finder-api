exports.notFoundRoute = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`)
  res.status(404)
  next(error)
}

exports.errorHandler = (error, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode
  res.status(statusCode).json({
    error: error.message,
    stack: process.env.NODE_ENV === 'production' ? null : error.stack,
  })
}