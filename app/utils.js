export const isServer = typeof window === 'undefined'

export const serverAddr = isServer ? `http://localhost:${process.env.PORT}` : ''
