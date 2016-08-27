module.exports = {
  postgresUrl: process.env.DATABASE_URL,
  postgresUsername: process.env.POSTGRES_USERNAME,
  postgresPassword: process.env.POSTGRES_PASSWORD,
  uniUrl: process.env.UNI_URL,
  emailAddress: process.env.EMAIL_USERNAME,
  emailPassword: process.env.EMAIL_PASSWORD,
  appSecret: process.env.APP_SECRET
}
