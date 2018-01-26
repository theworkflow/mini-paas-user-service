const Bunyan = require('bunyan')
const Bunyan2Loggly = require('bunyan-loggly')

const { name } = require('../package.json')
const { loggly } = require('../config')

const isDev = process.env.NODE_ENV === 'development'
let log

if (isDev) {
  log = Bunyan.createLogger({ name })
} else {
  log = Bunyan.createLogger({
    name,
    streams: [{
      type: 'raw',
      stream: new Bunyan2Loggly({
        token: loggly.token,
        subdomain: loggly.subdomain,
        json: true
      })
    }]
  })
}

module.exports = log
