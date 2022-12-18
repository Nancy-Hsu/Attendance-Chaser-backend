const express = require('express')
const router = express.Router()
const { apiErrorHandler } = require('../middleware/error-handler')
const userController = require('../controllers/user-controller')
// const passport = require('../../config/passport')

router.post('/login', userController.logIn)
router.get('/', (req, res) => {
  res.json({
    status: 'success',
    msg: 'hi'
  })
})
router.use('/', apiErrorHandler)
module.exports = router
