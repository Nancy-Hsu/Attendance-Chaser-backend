'use strict'
const { faker } = require('@faker-js/faker')
const bcrypt = require('bcryptjs')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hash = await bcrypt.hash('titaner', 10)
    const users = []
    for (let i = 1; i <= 50; i++) {
      const firstName = faker.name.firstName()
      const lastName = faker.name.lastName()
      const employee_id = Math.floor(i / 10) === 0 ? '00000' + String(i) : Math.floor(i / 100) === 0 ? '0000' + String(i) : '000' + String(i)

      users.push({
        employee_id, 
        account: employee_id,
        password: hash,
        email: lastName + firstName + '@example.com',
        name: lastName + ' ' + firstName,
        is_remote: i % 2 ? false : true,
        is_admin: i===1 ? true : false,
        avatar: `https://loremflickr.com/320/240/people/?random=${Math.random() * 100}`,
        created_at: new Date(),
        updated_at: new Date(),
      })
    }
    await queryInterface.bulkInsert('Users', users , {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {})
  }
}
