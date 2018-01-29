const { expect } = require('code')
const Lab = require('lab')
const Chai = require('chai')
const ChaiHTTP = require('chai-http')

const { after, before, describe, it } = exports.lab = Lab.script()

Chai.use(ChaiHTTP)

const server = require('../server')

describe('get all users', () => {
  describe('return no users', () => {
    it('should return 0 users', async () => {
      let error, res

      try {
        res = await Chai.request(server)
        .get('/users')
      } catch (err) {
        error = err
      }

      expect(error).not.to.exist()
      expect(res.status).to.equal(200)
      expect(res.body.users.length).to.equal(0)
    })
  })

  describe('return users', () => {
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

    it('should return 1 user', async () => {
      let error, res

      try {
        res = await Chai.request(server)
          .get('/users')
      } catch (err) {
        error = err
      }

      expect(error).not.to.exist()
      expect(res.status).to.equal(200)
      expect(res.body.users.length).to.equal(1)
    })

    it('should return 1 user when querying', async () => {
      let error, res

      try {
        res = await Chai.request(server)
          .get(`/users?email=${payload.email}`)
      } catch (err) {
        error = err
      }

      expect(error).to.not.exist()
      expect(res.status).to.equal(200)
      expect(res.body.users.length).to.equal(1)
    })

    it('should return 0 users based on query', async () => {
      let error, res

      try {
        res = await Chai.request(server)
          .get('/users?email=foobar')
      } catch (err) {
        error = err
      }

      expect(error).to.not.exist()
      expect(res.status).to.equal(200)
      expect(res.body.users.length).to.equal(0)
    })
  })
})
