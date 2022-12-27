
const { User, Attendance, Date } = require('../models')
const { distanceDiff } = require('../helpers/distanceDiff-helper')
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
const crossingStartHour = 00
const crossingEndHour = 05
const yearFormat = 'YYYYMMDD'
const timeFormat = 'HH:mm'
const gpsRange = 400
// const { Client } = require('@googlemaps/google-maps-services-js')
// const client = new Client({})

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault(process.env.VITE_TIME_ZONE)

const attendController = {
  postAttendance: async (req, res, next) => {
    const user = req.user.toJSON()
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
      if (distance > gpsRange) throw new Error('您離公司還太遠了！')
    }

    // 擷取日期與時間
    let today = req.body.timeStamp
    const time = dayjs(today).format(timeFormat)

    // 判斷換日線
    if ((dayjs(today).hour() >= crossingStartHour) && (dayjs(today).hour() <= crossingEndHour)) {
      today = dayjs(today).subtract(1, 'day').format(yearFormat)
    } else {
      today = dayjs(today).format(yearFormat)
    }
  
    const date = await Date.findOne({ where: { date: today } })
    if (!date) return
    //新增打卡紀錄
    const [record, created] = await Attendance.findOrCreate({
      where: { UserId: user.id, DateId: date.id },
      defaults: {
        startTime: time
      }
    })
    if (!created) {
      record.endTime = time
    }
    res.json({
      status: 'success',
      msg: '打卡成功！'
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