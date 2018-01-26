const Handler = require('../handlers/user')
// const Middleware = require('../middleware/user')

module.exports = server => {
  server.post('/users', Handler.create)
  server.get('/users', Handler.getAll)
  server.get('/users/:id', Handler.get)
  server.put('/users/:id', Handler.update)
  server.del('/users/:id', Handler.delete)
}
