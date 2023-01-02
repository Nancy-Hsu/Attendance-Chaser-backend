'use strict';
module.exports = (sequelize, DataTypes) => {
  const Attendance = sequelize.define('Attendance', {
    UserId: DataTypes.INTEGER,
    DateId: DataTypes.INTEGER,
    startTime: DataTypes.DATE,
    endTime: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Attendance',
    tableName: 'Attendances',
    underscored: true,
  });
  Attendance.associate = function(models) {
    Attendance.belongsTo(models.Date, { foreignKey: 'DateId' })
    Attendance.belongsTo(models.User, { foreignKey: 'UserId' })
  };
  return Attendance;
};