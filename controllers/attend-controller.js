
const { User, Attendance, Date } = require('../models')
const { distanceDiff } = require('../helpers/distanceDiff-helper')
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
const crossingStartHour = 00
const crossingEndHour = 05
const yearFormat = 'YYYYMMDD'
const gpsRange = 400

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault(process.env.VITE_TIME_ZONE)

const attendController = {
  postAttendance: async (req, res, next) => {
    const user = req.user.toJSON()
    //判斷距離
    if (!user.isRemote) {
      const origin = {
        lat: req.body.lat,
        lng: req.body.lng
      }
      const company = {
        lat: 25.05758954887687, 
        lng: 121.61231323665174
      }
      const distance = distanceDiff(origin, company)

      if (distance > gpsRange) throw new Error(`您離公司還有 ${distance} 公尺！飛毛腿快走!`)
    }

    // 擷取日期與時間
    let { timeStamp } = req.body

    if (!timeStamp) throw new Error('沒有時間')
    let localTime = dayjs.tz(timeStamp, "Asia/Taipei")
   
    // 判斷換日線
    if ((localTime.hour() >= crossingStartHour) && (localTime.hour() < crossingEndHour)) {
      localTime = localTime.subtract(1, 'day')
    } 

    const todayFormat = localTime.format(yearFormat)

    //反查日期與使用者
    const [date, userIsTrue] = await Promise.all([Date.findOne({ where: { date: todayFormat } }), User.findByPk(user.id)])
    if (!userIsTrue) throw new Error('沒有此使用者 !')
    if (!date) throw new Error('日期有誤!')
    //新增打卡紀錄
    const [record, created] = await Attendance.findOrCreate({
      where: { UserId: user.id, DateId: date.id },
      defaults: {
        startTime: timeStamp
      }
    })

    
    if (!created && record.startTime !== null ) {

      if (dayjs(timeStamp).isBefore(dayjs(record.startTime)))  throw new Error ('已經打過卡')
      await record.update({ endTime: timeStamp })
    }
    return res.json({
      status: 'success',
      msg: '打卡成功！',
      record
    })
  }
}

module.exports = attendController




      // client
      //   .findPlaceFromText({
      //     params: {
      //       input: '新加坡商泰坦科技',
      //       inputtype:'textquery',
      //       fields: ['name','place_id'],
      //       locationbias: 'Point',
      //       language: 'zh_TW',
      //       key: process.env.GOOGLE_KEY,
      //     },
      //     timeout: 5000, 
      //   })
      //   .then((r) => {
      //     console.log(r.data);
      //   })
      //   .catch((e) => {
      //     console.log(e.response.data.error_message);
      //   });