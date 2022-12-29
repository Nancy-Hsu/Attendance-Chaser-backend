require('express-async-errors')
const express = require('express')
const router = express.Router()
const { apiErrorHandler } = require('../middleware/error-handler')
const { authenticatedUser } = require('../middleware/auth')
const userController = require('../controllers/user-controller')
const attendController = require('../controllers/attend-controller')

// const passport = require('../../config/passport')

router.post('/users/login', userController.logIn)

router.put('/users/:userId', authenticatedUser, userController.putUser)
router.get('/users/:userId', authenticatedUser, userController.getUser)

router.post('/attendances', authenticatedUser, attendController.postAttendance)


router.get('/', (req, res) => {
  res.json({
    status: 'success',
    msg: 'hi'
  })
})
router.use('/', apiErrorHandler)
module.exports = router
