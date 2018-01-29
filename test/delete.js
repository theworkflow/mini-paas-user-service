const { expect } = require('code')
const Lab = require('lab')
const Chai = require('chai')
const ChaiHTTP = require('chai-http')
const Mongoose = require('mongoose')

const { before, describe, it } = exports.lab = Lab.script()

Chai.use(ChaiHTTP)

const server = require('../server')

describe('delete user', () => {
  let userRes
  const objectId = new Mongoose.Types.ObjectId()
  const payload = {
    email: 'example@example.com',
    password: 'foobar',
    username: 'example'
  }

  before(async () => {
    userRes = await Chai.request(server)
      .post('/users')
      .send(payload)
  })

  it('should fail to delete non-existing user', async () => {
    let error

    try {
      await Chai.request(server)
        .delete(`/users/${objectId}`)
    } catch (err) {
      error = err
    }

    expect(error).to.exist()
    expect(error.status).to.equal(410)
  })

  it('should delete user', async () => {
    let error, res

    try {
      res = await Chai.request(server)
        .delete(`/users/${userRes.body.user.id}`)
    } catch (err) {
      error = err
    }

    expect(error).to.not.exist()
    expect(res.status).to.equal(204)

    try {
      await Chai.request(server)
        .get(`/users/${userRes.body.user.id}`)
    } catch (err) {
      error = err
    }

    expect(error).to.exist()
    expect(error.status).to.equal(404)
  })
})
