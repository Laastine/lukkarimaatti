const assert = require('assert')
const {isEmpty} = require('ramda')

function required(configVal) {
  const val = process.env[configVal]
  assert(val, `${configVal} environment variable is required`)
  return val
}

function optional(configVal) {
  const val = process.env[configVal]
  if (isEmpty(val)) {
    // eslint-disable-next-line no-console
    console.warn(`${configVal} environment value is not present`)
  }
  return val
}

module.exports = {
  postgresUrl: required('DATABASE_URL'),
  uniUrl: required('UNI_URL'),
  emailAddress: optional('EMAIL_USERNAME'),
  emailPassword: optional('EMAIL_PASSWORD'),
  appSecret: required('APP_SECRET'),
  letsEncryptResponse: optional('CERTBOT_RESPONSE'),
  logLevel: optional('LOG_LEVEL')
}
