var expect = chai.expect
chai.should()
chai.config.truncateThreshold = 0

var eventTimeout = 15000

function loadPage(path, predicate) {
  if (!predicate) {
    throw new Error('No predicate defined')
  }
  var newTestFrame = $('<iframe/>').attr({src: path, width: 1200, height: 800, id: 'testframe'})
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
  return function () {
    var started = Date.now()
    return (function loop() {
      return Promise.resolve(predicate()).then(function (result) {
        if (result) {
          return result
        } else if (Date.now() - started < timeout) {
          return Promise.delay(1000).then(loop)
        } else {
          throw new Error('Couldn\'t fill predicate in ' + timeout / 1000 + ' seconds')
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
    return new Promise(function (resolve) {
      $('#testframe').get(0).contentWindow.history.back()
      resolve()
    })
  }
}

function triggerEvent(element, eventName) {
  var event = testFrame().document.createEvent('Event')
  event.initEvent(eventName, true, false)
  element.dispatchEvent(event)
}

function setInputValue(el, index, elementValue) {
  var idx = index ? index : 0
  return function () {
    return waitUntil(function () {
      return S(el).length > 0
    }, eventTimeout)()
      .then(function () {
        $(S(el)[idx]).val(elementValue)
        triggerEvent(S(el)[idx], 'input')
        triggerEvent(S(el)[idx], 'keyup')
      })
      .catch(function (err) {
        console.log(err)
        console.log(el + ' ' + index + ' ' + elementValue)
      })
  }
}

function click(el, index) {
  return function () {
    return waitUntil(function () {
      return S(el).length > 0
    }, eventTimeout)()
      .then(function () {
        triggerEvent(S(el)[index ? index : 0], 'click')
      })
      .delay(500)
      .catch(function (err) {
        console.log(err)
        console.log(el + ' ' + index)
      })
  }
}

function change(el, index) {
  return function () {
    return waitUntil(function () {
      return S(el).length > 0
    }, eventTimeout)()
      .then(function () {
        triggerEvent(S(el)[index ? index : 0], 'change')
      })
  }
}

function wait(duration) {
  return function () {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        resolve();
      }, duration)
    });
  }
}

function getElementWithText(selector, text) {
  var elements = S(selector);
  return Array.prototype.filter.call(elements, function (element) {
    return RegExp(text).test(element.textContent);
  })
}


function clickText(el, regex) {
  return function () {
    return waitUntil(function () {
      return getElementWithText(el, regex).length > 0
    }, eventTimeout)()
      .then(function () {
        triggerEvent(getElementWithText(el, regex)[0], 'click')
      })
      .delay(500)
      .catch(function (err) {
        console.log(err)
        console.log(el)
      })
  }
}


