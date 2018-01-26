// config/components/loggly.js
const joi = require('joi')

const envVars = {
  LOGGLY_SUBDOMAIN: joi.string()
    .required(),
  LOGGLY_TOKEN: joi.string()
    .required()
}

const schema = joi.object(envVars).unknown().required()
const { error, value: env } = joi.validate(process.env, schema)
if (error) throw new Error(`Config validation error: ${error.message}`)

const config = {
  loggly: {
    subdomain: env.LOGGLY_SUBDOMAIN,
    token: env.LOGGLY_TOKEN
  }
}

module.exports = config
