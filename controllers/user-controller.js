const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { User } = require('../models')


const userController = {
  logIn: async (req, res, next) => {
    const { account, password } = req.body
    if (!account || !password) {
      throw new Error('these two filed are required')
    }
    const user = await User.findOne({ where: { account } })
    if (!user || !bcrypt.compareSync(password, user.password)) throw new Error('password or account incorrect!')
    const userData = user.toJSON()
    delete userData.password
    try {
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      return res.json({
        status: 'success',
        token,
        user: userData
      })
    } catch (err) {
      next(err)
    }
  },
  putUser: async (req, res, next) => {
    // PUT /api/user/:userId
    const { userId } = req.params

    const { oldPassword, newPassword, newPasswordCheck } = req.body
    if (!oldPassword || !newPassword || !newPasswordCheck) {
      throw new Error('全部欄位為必填')
    }

    if (newPassword !== newPasswordCheck) {
      throw new Error('新密碼與確認密碼不相同')
    }
    const user = await User.findByPk(userId)

    if (!user || !bcrypt.compareSync(oldPassword, user.password)) throw new Error('密碼有誤！')

    const result = await user.update({
      password: bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10), null)
    })

    result ? res.json({
      status: 'success',
      message: 'change succeeded !'
    }) : res.send(500)

  },
  getUser: async (req, res, next) => {
    const { userId } = req.params
    const user = await User.findByPk(userId, { attributes: { exclude: ['password'] } })
    const userData = user.toJSON()
    res.json({
      status: 'success',
      user: userData
    })
  },
}
module.exports = userController