export const isServer = typeof window === 'undefined'

export const serverAddr = isServer ? `http://localhost:${process.env.PORT}` : ''

export const isEmail = (str) => /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(str)

export const isCourseLink = (str) => /^(https:\/\/lukkarimaatti\.ltky\.fi|http:\/\/localhost:8080)\/\?courses=[A-Za-z%()0-9=+-]+$/.test(str)
