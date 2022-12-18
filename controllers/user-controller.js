const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
require('express-async-errors');
const usersServices = require('../services/user-services')
const { User } = require('../models')


const userController = {
  logIn: async (req, res, next) => {
    const { account, password } = req.body
    if (!account || !password) {
      throw new Error('these two filed are required')
    }
    const user = await User.findOne({ where: { account } })
    if (!bcrypt.compareSync(password, user.password)) throw new Error('password or account incorrect!')
    const userData = user.toJSON()
    delete userData.password
    try {
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      return res.json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  }
}
module.exports = userController