module.exports = {
  apiErrorHandler(err, req, res, next) {
    if (err instanceof Error) {
      return res.status(err.status || 500).json({
        status: 'error',
        message: `${err.name}: ${err.message}`
      })
    } else {
      return res.status(500).json({
        status: 'error',
        message: `${err}`
      })
    }
    next(err)
  }
}