export const isServer = typeof window === 'undefined'

export const serverAddr = isServer ? 'http://localhost:8080' : ''
