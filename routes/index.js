require('express-async-errors')
const express = require('express')
const router = express.Router()
const { apiErrorHandler } = require('../middleware/error-handler')
const { authenticatedUser } = require('../middleware/auth')
const userController = require('../controllers/user-controller')
const attendController = require('../controllers/attend-controller')

router.post('/users/login', userController.logIn)
router.put('/users/:userId', authenticatedUser, userController.putUser)
router.get('/users/:userId', authenticatedUser, userController.getUser)
router.get('/users/:userId/absence', authenticatedUser, userController.getUserAbsence)
router.get('/currentUser', authenticatedUser, userController.getCurrentUser)

router.post('/attendances', authenticatedUser, attendController.postAttendance)

// router.get('/users/:userId/QRcode', authenticatedUser, userController.getQRcodeInfo)


router.get('/', (req, res) => {
  res.json({
    status: 'success',
    msg: 'hi'
  })
})
router.use('/', apiErrorHandler)
module.exports = router
