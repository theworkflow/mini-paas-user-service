const { expect } = require('code')
const Lab = require('lab')
const Chai = require('chai')
const ChaiHTTP = require('chai-http')
const Mongoose = require('mongoose')

const { after, before, describe, it } = exports.lab = Lab.script()

Chai.use(ChaiHTTP)

const server = require('../server')

describe('get user', () => {
  const objectId = new Mongoose.Types.ObjectId()
  let userRes
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

  it('should fail when getting invalid user', async () => {
    let error

    try {
      await Chai.request(server)
        .get(`/users/${objectId}`)
    } catch (err) {
      error = err
    }

    expect(error).to.exist()
    expect(error.status).to.equal(404)
  })

  it('should get user', async () => {
    let error, res

    try {
      res = await Chai.request(server)
        .get(`/users/${userRes.body.user.id}`)
    } catch (err) {
      error = err
    }

    expect(error).to.not.exist()
    expect(res.status).to.equal(200)
    expect(res.body.user).to.part.include(payload)
  })
})
