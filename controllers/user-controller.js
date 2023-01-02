const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const sequelize = require('sequelize')
const { Op } = require('sequelize')
const { User, Attendance,  Date} = require('../models')


const userController = {
  logIn: async (req, res, next) => {
    const { account, password } = req.body
    if (!account || !password) {
      throw new Error('these two filed are required')
    }
    const user = await User.findOne({ where: { account } })
    if (!user) throw new Error('password or account incorrect!')
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
  getCurrentUser : async(req, res, next) => {
    const currentUser = req.user.toJSON()
    delete currentUser.updatedAt
    delete currentUser.password
    res.json({
      status: 'success',
      currentUser
    })
},
  getUserAbsence: async(req, res, next) => {
    const user = req.user.toJSON()
    const { userId } = req.params

    if (user.id.toString() !== userId) throw new Error ('您沒有權限')

    const data = await Attendance.findAll({
      order: [['created_at', 'DESC']],
      include: [
        { model: Date, where: { is_holiday: false }, attributes: [] }
      ],
      attributes: {
        include: [[
          sequelize.literal('timestampdiff(hour, start_time, end_time )'), 'workHour']]
      },

      where: {
        [Op.and]:
        [{ UserId: userId },
        { where: sequelize.where(sequelize.fn("month", sequelize.col("Attendance.created_at")), 1) }],
      },
      raw: true 
    })
    const absenceData = data.filter(item => {
      if (!item.workHour || item.workHour < 9) return item
    })

    res.json({
      status: 'success',
      absenceData
    })
  }
}
module.exports = userController