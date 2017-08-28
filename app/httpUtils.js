export const frameOptions = (req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('X-Content-Type-Options', 'nosniff')
  next()
}

export const hsts = (req, res, next) => {
  const maxAge = Math.round(60 * 60 * 24 * 183) //Half year
  res.setHeader('Strict-Transport-Security', `max-age=${maxAge}; includeSubDomains; preload`)
  next()
}
