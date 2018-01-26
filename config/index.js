const joi = require('joi')

const mongo = require('./components/mongo')
const loggly = require('./components/loggly')

const envVars = {
  PORT: joi.number()
    .integer()
    .min(0)
    .max(65535)
    .default(8001)
}

const schema = joi.object(envVars).unknown().required()
const { error, value: env } = joi.validate(process.env, schema)
if (error) throw new Error(`Config validation error: ${error.message}`)

const config = {
  host: env.HOST,
  port: env.PORT
}

module.exports = Object.assign({}, config, mongo, loggly)
