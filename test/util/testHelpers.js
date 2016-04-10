var expect = chai.expect
chai.should()
chai.config.truncateThreshold = 0

var eventTimeout = 5000

function loadPage(path, predicate) {
  if (!predicate) {
    throw new Error('No predicate defined');
  }
  var newTestFrame = $('<iframe/>').attr({src: path, width: 1024, height: 768, id: 'testframe'}).load(function () {
    var jquery = document.createElement("script")
    jquery.type = "text/javascript"
    jquery.src = "//code.jquery.com/jquery-1.11.1.min.js"
    $(this).contents().find("head")[0].appendChild(jquery)
  })
  $('#testframe').replaceWith(newTestFrame)
  return waitUntil(predicate, eventTimeout)()
    .then(function () {
      window.uiError = null
      testFrame().onerror = function (err) {
        window.uiError = err;
      } // Hack: force mocha to fail on unhandled exceptions
    })
}

function testFrame() {
  return $('#testframe').get(0).contentWindow;
}

function S(selector) {
  try {
    if (!testFrame() || !testFrame().jQuery) {
      return $([])
    }
    return testFrame().jQuery(selector)
  } catch (e) {
    console.log("Premature access to testFrame.jQuery, printing stack trace.")
    console.log(new Error().stack);
    throw e;
  }
}

function waitUntil(predicate, timeout) {
  return function () {
    var started = Date.now();
    return (function loop() {
      return Promise.resolve(predicate()).then(function (result) {
        if (result) {
          return result;
        } else if (Date.now() - started < timeout) {
          return Promise.delay(1000).then(loop);
        } else {
          throw new Error('Couldn\'t fill predicate in ' + timeout / 1000 + ' seconds');
        }
      })
    })();
  }
}

function triggerEvent(element, eventName) {
  const evt = testFrame().document.createEvent('HTMLEvents')
  evt.initEvent(eventName, true, true)
  element[0].dispatchEvent(evt)
}

function monkeyPatchBrowserAPI(el) {
  return Clickable(function () {
    return S(el)
  })
}

function Clickable(el) {
  return {
    element: function () {
      return el()
    },
    isEnabled: function () {
      return el().is(":enabled")
    },
    isVisible: function () {
      return el().is(":visible")
    },
    text: function () {
      return el().text()
    },
    click: function () {
      triggerEvent(el().first(), "click")
    }
  }
}

(function improveMocha() {
  var origBefore = before
  before = function () {
    Array.prototype.slice.call(arguments).forEach(function (arg) {
      if (typeof arg !== "function") {
        throw ("not a function: " + arg)
      }
      origBefore(arg)
    })
  }
})()
