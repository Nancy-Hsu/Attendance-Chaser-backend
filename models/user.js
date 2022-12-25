'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    account: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    employeeId: DataTypes.STRING,
    name: DataTypes.STRING,
    isRemote: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    underscored: true,
  });
  User.associate = function(models) {
    User.hasMany(models.Attendance, { foreignKey: 'UserId' })
  };
  return User;
};