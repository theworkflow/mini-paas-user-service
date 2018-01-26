const Controller = require('../../controllers/user')

exports.getAll = (req, res, next) => {
  Controller.getAll(req.query, (err, users) => {
    if (err) return next(err)
    res.send(200, { users })
  })
}

exports.create = (req, res, next) => {
  Controller.create(req.body, (err, user) => {
    if (err) return next(err)
    res.send(201, { user })
  })
}

exports.get = (req, res, next) => {
  const { id } = req.params

  Controller.get(id, (err, user) => {
    if (err) return next(err)
    res.send(200, { user })
  })
}

exports.update = (req, res, next) => {
  const { id } = req.params
  const payload = req.body

  Controller.update(id, payload, (err) => {
    if (err) return next(err)
    res.send(204)
  })
}

exports.delete = (req, res, next) => {
  const { id } = req.params

  Controller.delete(id, (err) => {
    if (err) return next(err)
    res.send(204)
  })
}
