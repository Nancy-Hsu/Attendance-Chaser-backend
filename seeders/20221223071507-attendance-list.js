'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query('SELECT id FROM Users;', { type: queryInterface.sequelize.QueryTypes.SELECT })
    const workDays = await queryInterface.sequelize.query('SELECT id, date FROM Dates where is_holiday = false;', { type: queryInterface.sequelize.QueryTypes.SELECT })
    
    const data = []
     workDays.forEach(workDay => {
      users.forEach(user => (
        data.push({
        User_id: user.id,
        Date_id: workDay.id,
        start_time: workDay.date + ' 00:00',
        end_time: workDay.date + ' 10:00',
        created_at: workDay.date,
        updated_at: workDay.date
      })))
    })
    await queryInterface.bulkInsert('Attendances', data, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Attendances', null, {})
  }
}
