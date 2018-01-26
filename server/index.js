const { port } = require('../config')
const Logger = require('../lib/logger')

const Restify = require('restify')

const Routes = require('./routes')
const { name, version } = require('../package.json')

const server = Restify.createServer({ name, version })

server.use(Restify.plugins.jsonBodyParser({ mapParams: true }))
server.use(Restify.plugins.acceptParser(server.acceptable))
server.use(Restify.plugins.queryParser({ mapParams: true }))
server.use(Restify.plugins.fullResponse())

Routes(server)

server.listen(port, () => {
  Logger.info('Server running')
})

module.exports = server
