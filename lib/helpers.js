const Bcrypt = require('bcrypt')

const Logger = require('./logger')

exports.hashPassword = ({ password }) => done => {
  const saltRounds = 10

  Bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) {
      Logger.error('failed to generate salt', err)
      return done(err)
    }

    Bcrypt.hash(password, salt, (err, hash) => {
      if (err) {
        Logger.error('failed to hash password', err)
        return done(err)
      }

      done(null, hash)
    })
  })
}
