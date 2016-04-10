var expect = chai.expect
chai.should()
chai.config.truncateThreshold = 0

var eventTimeout = 5000

function loadPage(path, predicate) {
  if (!predicate) {
    throw new Error('No predicate defined');
  }
  var newTestFrame = $('<iframe/>').attr({src: path, width: 1200, height: 800, id: 'testframe'});
  $('#testframe').replaceWith(newTestFrame);
  return waitUntil(predicate, eventTimeout)();
}

function testFrame() {
  return $('#testframe').get(0).contentWindow;
}

function S(selector) {
  return Array.prototype.slice.call(testFrame().document.querySelectorAll(selector))
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
  var event = testFrame().document.createEvent('HTMLEvents');
  event.initEvent(eventName, true, true);
  element.dispatchEvent(event);
}

function click(el) {
  return function () {
    return waitUntil(function () {
      return S(el).length > 0
    }, eventTimeout)()
      .then(function () {
        triggerEvent(S(el)[0], 'click')
      })
  }
}
