require('../app/augmentRuntime')
import Browser from 'zombie'
import * as server from '../app/server'

const serverPort = 8080
server.start(serverPort).then(run)

Browser.localhost('localhost', serverPort)

context('User visits the front page', () => {
    const browser = new Browser()
    before((done) => {
        browser.visit('/', done)
    })

    describe('button click', () => {

        it('Open save dialog', () => {
            browser.clickLink('#saveModalButton')
            browser.assert.text('#saveId', 'Send')
        })
    })
})