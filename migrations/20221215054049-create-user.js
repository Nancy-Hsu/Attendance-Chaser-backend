'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      employee_id: {
        allowNull: false,
        type: Sequelize.STRING
      },
      account: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: 'titaner'
      },
      email: {
        type: Sequelize.STRING
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      login_wrong_times: {
        type: Sequelize.INTEGER,
        defaultValue: '0'
      },
      is_remote: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      is_delete: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      avatar: {
        type: Sequelize.STRING,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};