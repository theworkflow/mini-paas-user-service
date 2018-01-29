const { expect } = require('code')
const Lab = require('lab')
const Chai = require('chai')
const ChaiHTTP = require('chai-http')

const server = require('../server')

const { after, before, beforeEach, describe, it } = exports.lab = Lab.script()

Chai.use(ChaiHTTP)

describe('create user', () => {
  let payload

  beforeEach(async () => {
    payload = {
      email: 'example@example.com',
      password: 'foobar',
      username: 'example'
    }
  })

  describe('user validation', () => {
    it('should fail on missing email', async () => {
      let error
      delete payload.email

      try {
        await Chai
        .request(server)
        .post('/users')
        .send(payload)
      } catch (err) {
        error = err
      }

      expect(error.status).to.equal(400)
      expect(error.response.body.message).to.equal('Email is required')
    })

    it('should fail on missing password', async () => {
      let error
      delete payload.password

      try {
        await Chai
        .request(server)
        .post('/users')
        .send(payload)
      } catch (err) {
        error = err
      }

      expect(error.status).to.equal(400)
      expect(error.response.body.message).to.equal('Password is required')
    })

    it('should fail on missing username', async () => {
      let error
      delete payload.username

      try {
        await Chai
          .request(server)
          .post('/users')
          .send(payload)
      } catch (err) {
        error = err
      }

      expect(error.status).to.equal(400)
      expect(error.response.body.message).to.equal('Username is required')
    })
  })

  describe('email or username exists', () => {
    let res
    const defaultPayload = {
      email: 'example@example.com',
      password: 'foobar',
      username: 'example'
    }

    before(async () => {
      res = await Chai
      .request(server)
      .post('/users')
      .send(defaultPayload)
    })

    after(async () => {
      await Chai.request(server)
        .delete(`/users/${res.body.user.id}`)
    })

    it('should fail if email exists', async () => {
      let error
      defaultPayload.username = 'diffUsername'

      try {
        await Chai
          .request(server)
          .post('/users')
          .send(payload)
      } catch (err) {
        error = err
      }

      expect(error.status).to.equal(400)
      expect(error.response.body.message).to.equal('User exists')
    })

    it('should fail if username exists', async () => {
      let error
      defaultPayload.email = 'new@example.com'

      try {
        await Chai
          .request(server)
          .post('/users')
          .send(payload)
      } catch (err) {
        error = err
      }

      expect(error.status).to.equal(400)
      expect(error.response.body.message).to.equal('User exists')
    })
  })

  it.skip('should fail if password not strong enough')

  describe('success', () => {
    let res

    after(async () => {
      await Chai.request(server)
        .delete(`/users/${res.body.user.id}`)
    })

    it('should succeed', async () => {
      let error
      const userPayload = {
        username: 'foobar',
        email: 'foo@bar.com',
        password: 'foobar'
      }

      try {
        res = await Chai.request(server)
        .post('/users')
        .send(userPayload)
      } catch (err) {
        error = err
      }

      expect(error).not.to.exist()
      expect(res.status).to.equal(201)
      expect(res.body.user).to.part.include(userPayload)
    })
  })
})
