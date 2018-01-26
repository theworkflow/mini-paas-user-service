const Errors = require('restify-errors')
const Omit = require('lodash.omit')
const Waterfall = require('run-waterfall')

const { hashPassword } = require('../lib/helpers')
const { BLACKLISTED_PROPS } = require('../lib/constants')
const Logger = require('../lib/logger')
const UserModel = require('../models/user')

exports.getAll = (query, done) => {
  UserModel.find(query)
    .select('-password')
    .exec((err, users) => {
      if (err) {
        Logger.error('failed to get users', query, err)
        return done(new Errors.FailedDependencyError('Failed to get users'))
      }

      done(null, users)
    })
}

exports.create = (payload, done) => {
  const tasks = [
    validateNewUser(payload),
    emailOrUsernameDoesNotExists(payload),
    hashPassword(payload),
    (hash, next) => createUser(hash, payload)(next)
  ]

  Waterfall(tasks, done)
}

exports.get = (userId, done) => {
  const opts = { errorType: 'NotFoundError', stripProps: true }

  findById(userId, opts, done)
}

exports.update = (userId, payload, done) => {
  findById(userId, { errorType: 'NotFoundError' }, (err, doc) => {
    if (err) return done(err)

    const data = Object.assign(Omit(payload, BLACKLISTED_PROPS), {
      updatedAt: new Date()
    })

    UserModel.findByIdAndUpdate(userId, data, (err) => {
      if (err) {
        Logger.error('failed to update user', userId, err)
        return done(new Errors.ConflictError('Failed to update user'))
      }

      done()
    })
  })
}

exports.delete = (userId, done) => {
  findById(userId, { errorType: 'GoneError' }, (err) => {
    if (err) return done(err)

    UserModel.remove({ _id: userId }, (err) => {
      if (err) {
        Logger.error('failed to delete user', userId, err)
        return done(new Errors.GoneError('User not found'))
      }

      done()
    })
  })
}

const validateNewUser = user => done => {
  if (!user.email) return done(new Errors.BadRequestError('Email is required'))
  if (!user.password) return done(new Errors.BadRequestError('Password is required'))
  if (!user.username) return done(new Errors.BadRequestError('Username is required'))

  done()
}

const emailOrUsernameDoesNotExists = ({ email, username }) => done => {
  UserModel.findByEmailOrUsername(email, username, (err, doc) => {
    if (err) {
      Logger.error('failed to find user by email or username', email, username, err)
      return done(new Errors.FailedDependencyError('Failed to find user'))
    }

    if (doc.length) {
      Logger.warn('user already exists', email, username)
      return done(new Errors.BadRequestError('User exists'))
    }

    done()
  })
}

const createUser = (hash, payload) => done => {
  const data = Object.assign({}, payload, { password: hash })
  const user = new UserModel(data)

  user.save(err => {
    if (err) {
      Logger.error('failed to create user', data.email, err)
      return done(new Errors.FailedDependencyError(err))
    }

    findById(user.id, { errorType: 'NotFoundError', stripProps: true }, done)
  })
}

const findById = (id, { errorType, stripProps = false }, done) => {
  const query = UserModel.findById(id)

  if (stripProps) query.select('-password')

  query.exec((err, user) => {
    if (err) {
      Logger.error('failed to get user', id, err)
      return done(new Errors[errorType]('User not found'))
    }

    if (!user) {
      Logger.warn('user not found', id)
      return done(new Errors[errorType]('User not found'))
    }

    done(null, user)
  })
}
