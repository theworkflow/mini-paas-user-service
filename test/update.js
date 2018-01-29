const { expect } = require('code')
const Lab = require('lab')
const Chai = require('chai')
const ChaiHTTP = require('chai-http')
const Mongoose = require('mongoose')

const { after, before, describe, it } = exports.lab = Lab.script()

Chai.use(ChaiHTTP)

const server = require('../server')

describe('update user', () => {
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

  after(async () => {
    await Chai.request(server)
      .delete(`/users/${userRes.body.user.id}`)
  })

  it('should fail on updating non-existing user', async () => {
    let error

    try {
      await Chai.request(server)
        .put(`/users/${objectId}`)
        .send({ username: 'newfoobar' })
    } catch (err) {
      error = err
    }

    expect(error).to.exist()
    expect(error.status).to.equal(404)
  })

  it('should fail when trying to update bad properties', async () => {
    let error

    try {
      await Chai.request(server)
        .put(`/users/${userRes.body.user.id}`)
        .send({ password: 'updatedFooBar', foo: 'bar', test: true })
    } catch (err) {
      error = err
    }

    expect(error).to.exist()
    expect(error.status).to.equal(400)
  })

  it('should update user', async () => {
    let error, res

    try {
      res = await Chai.request(server)
        .put(`/users/${userRes.body.user.id}`)
        .send({ username: 'updatedUsername' })
    } catch (err) {
      error = err
    }

    expect(error).to.not.exist()
    expect(res.status).to.equal(204)

    res = await Chai.request(server)
      .get(`/users/${userRes.body.user.id}`)

    expect(res.body.user.username).to.equal('updatedUsername')
  })
})
