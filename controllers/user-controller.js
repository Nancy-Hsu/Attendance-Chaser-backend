const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const dayjs = require('dayjs')
const sequelize = require('sequelize')
const { Op } = require('sequelize')
const { User, Attendance, Date } = require('../models')
const loginWrongLimit = 5


const userController = {
  logIn: async (req, res, next) => {
    const { account, password } = req.body
    // 檢查欄位
    if (!account || !password) {
      throw new Error('these two filed are required')
    }
    const user = await User.findOne({ where: { account } })
    // 檢查帳號
    if (!user) throw new Error('password or account incorrect!')
    // 檢查帳號是否上鎖
    if (user.loginWrongTimes >= 5) {
      throw new Error('帳號已上鎖，請 30 分鐘後再試！')
    }
    //密碼錯誤開始累計次數
    if (!bcrypt.compareSync(password, user.password)) {
      user.loginWrongTimes += 1
      const updatedUser = await user.save()
      const { loginWrongTimes } = updatedUser
      // 當下是第五次則上鎖並計時
      if (loginWrongTimes >= 5) {
        setTimeout(async () => {
          user.loginWrongTimes = '0'
          await user.save()
        }, 1800000)
        throw new Error('帳號已上鎖，請 30 分鐘後再試')
      }
      res.json({
        status: 'warning',
        msg: `密碼已錯誤 ${loginWrongTimes} 次，達 ${loginWrongLimit} 次將限制帳號`,
        loginWrongTimes
      })
    }
    // 若有殘留次數會再一天後消失
    if (user.loginWrongTimes) {
      setTimeout(async () => {
        user.loginWrongTimes = '0'
        await user.save()
      }, 86400000)
    }
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
    const currentUser = req.user.toJSON()
    const { userId } = req.params

    if (currentUser.id.toString() !== userId) throw new Error('您沒有權限')

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
  getCurrentUser: async (req, res, next) => {
    const currentUser = req.user.toJSON()
    delete currentUser.updatedAt
    delete currentUser.password
    res.json({
      status: 'success',
      currentUser
    })
  },
  getUserAbsence: async (req, res, next) => {
    const user = req.user.toJSON()
    const { userId } = req.params

    if (user.id.toString() !== userId) throw new Error('您沒有權限')
    const currentMonth = dayjs().month()+1

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
          {
            [Op.or]: [
              {
              where: sequelize.where(sequelize.fn("month", sequelize.col("Attendance.start_time")), currentMonth)
            },
            {
              where: sequelize.where(sequelize.fn("month", sequelize.col("Attendance.start_time")), currentMonth - 1 || 12  ),
            }
          ]
          }],
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