module.exports = {
  "development": {
    "username": "root",
    "password": "password",
    "database": "attendance_chaser",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "timezone": "+08:00",
    "dialectOptions": {
      "dateStrings": true,
      "typeCast": true
    }
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "operatorsAliases": false
  },
  "production": {
  "username": process.env.production_username,
    "password": process.env.production_password,
    "database": process.env.production_database,
    "host": process.env.production_host,
    "dialect": process.env.production_dialect,
    "port": process.env.production_port
  }
}