'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query('SELECT id FROM Users;', { type: queryInterface.sequelize.QueryTypes.SELECT })
    const workDays = await queryInterface.sequelize.query('SELECT id FROM Dates where is_holiday = false;', { type: queryInterface.sequelize.QueryTypes.SELECT })

    const data = workDays.map(workDay => ({
      User_id: users[Math.floor(Math.random() * users.length)].id,
      Date_id: workDay.id,
      start_time: '08:00',
      end_time: '18:00',
      created_at : new Date(),
      updated_at : new Date()
    }))

    await queryInterface.bulkInsert('Attendances', data, {});

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Attendances', null, {});

  }
};
