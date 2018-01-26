const { mongo } = require('../config')
const Mongoose = require('mongoose')
const Logger = require('./logger')

const options = {
  promiseLibrary: global.Promise,
  autoReconnect: true,
  keepAlive: 1,
  socketTimeoutMS: 30000,
  connectTimeoutMS: 30000
}

Mongoose.connect(mongo.uri, options)
Mongoose.connection.on('error', (err) => {
  Logger.error('Mongoose connection error', err)
  throw err
})

module.exports = Mongoose
