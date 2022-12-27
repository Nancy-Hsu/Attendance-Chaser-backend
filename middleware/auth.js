const passport = require('../config/passport')
const authenticatedUser = passport.authenticate('jwt', { session: false })

module.exports = {
  authenticatedUser
}