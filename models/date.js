'use strict';
module.exports = (sequelize, DataTypes) => {
  const Date = sequelize.define('Date', {
    date: DataTypes.DATEONLY,
    week: DataTypes.STRING,
    isHoliday: DataTypes.BOOLEAN,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Date',
    tableName: 'Dates',
    underscored: true,
  });
  Date.associate = function(models) {
    // associations can be defined here
  };
  return Date;
};