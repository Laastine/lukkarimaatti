/* eslint-env jquery */
/* global chai */
/* eslint-disable no-unused-vars */
const {expect} = chai
chai.should()
chai.config.truncateThreshold = 0

const eventTimeout = 15000

function loadPage(path, predicate) {
  if (!predicate) {
    throw new Error('No predicate defined')
  }
  const newTestFrame = $('<iframe/>').attr({src: path, width: 1200, height: 800, id: 'testframe'})
  $('#testframe').replaceWith(newTestFrame)
  return waitUntil(predicate, eventTimeout)()
}

function testFrame() {
  return $('#testframe').get(0).contentWindow
}

function S(selector) {
  return Array.prototype.slice.call(testFrame().document.querySelectorAll(selector))
}

function waitUntil(predicate, timeout) {
  const wait = timeout ? timeout : 3000
  return function () {
    const started = Date.now()
    return (function loop() {
      return Promise.resolve(predicate()).then((result) => {
        if (result) {
          return result
        } else if (Date.now() - started < wait) {
          return Promise.delay(1000).then(loop)
        } else {
          throw new Error(`Couldn't fill predicate in ${wait / 1000} seconds`)
        }
      })
    })()
  }
}

function getWindowUrl() {
  return testFrame().location.href
}

function getSelectedCoursesFromUrl() {
  return getWindowUrl()
    .replace(/[\w\/:]+\?courses=/, '')
    .split('+')
    .sort()
}

function browserBack() {
  return function () {
    return new Promise((resolve) => {
      $('#testframe').get(0).contentWindow.history.back()
      resolve()
    })
  }
}

function triggerEvent(element, eventName) {
  const event = testFrame().document.createEvent('Event')
  event.initEvent(eventName, true, false)
  element.dispatchEvent(event)
}

function setInputValue(el, index, elementValue) {
  const idx = index ? index : 0
  return function () {
    return waitUntil(() => S(el).length > 0, eventTimeout)()
      .then(() => {
        $(S(el)[idx]).val(elementValue)
        triggerEvent(S(el)[idx], 'input')
        triggerEvent(S(el)[idx], 'keyup')
      })
      .catch((err) => {
        console.log(`${err} ${el} ${index} ${elementValue}`) // eslint-disable-line no-console
      })
  }
}

function click(el, index) {
  return function () {
    return waitUntil(() => S(el).length > 0, eventTimeout)()
      .then(() => {
        triggerEvent(S(el)[index ? index : 0], 'click')
      })
      .delay(500)
      .catch((err) => {
        console.log(`${err} ${el} ${index}`) // eslint-disable-line no-console
      })
  }
}

function change(el, index) {
  return function () {
    return waitUntil(() => S(el).length > 0, eventTimeout)()
      .then(() => {
        triggerEvent(S(el)[index ? index : 0], 'change')
      })
  }
}

function wait(duration) {
  return function () {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve()
      }, duration)
    })
  }
}

function getElementWithText(selector, text) {
  const elements = S(selector)
  return Array.prototype.filter.call(elements, (element) => RegExp(text).test(element.textContent))
}

function clickText(el, regex) {
  return function () {
    return waitUntil(() => getElementWithText(el, regex).length > 0, eventTimeout)()
      .then(() => {
        triggerEvent(getElementWithText(el, regex)[0], 'click')
      })
      .delay(500)
      .catch((err) => {
        console.log(err, el) // eslint-disable-line no-console
      })
  }
}
/* eslint-enable no-unused-vars */
