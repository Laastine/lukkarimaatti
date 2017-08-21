import appConfig from './config'

export const frameOptions = () => (req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY')
  next()
}

export const hsts = () => {
  const maxAge = Math.round(60 * 60 * 24)
  return (req, res, next) => {
    res.setHeader('Strict-Transport-Security', `max-age=${maxAge}; includeSubDomains; preload`)
    next()
  }
}