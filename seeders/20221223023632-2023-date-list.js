'use strict'

const axios = require('axios')
const year = 2023
const dateApi = `https://cdn.jsdelivr.net/gh/ruyut/TaiwanCalendar/data/${year}.json`

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const response = await axios.get(dateApi)
    response.data.forEach(item => {
      item.is_holiday = item.isHoliday
      delete item.isHoliday
      item.created_at = new Date()
      item.updated_at = new Date()
    })
    await queryInterface.bulkInsert('Dates', response.data, {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Dates', null, {})
  }
}
