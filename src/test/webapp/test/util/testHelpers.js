var expect = chai.expect
chai.should()
chai.config.truncateThreshold = 0 // disable truncating

function Button(el) {
    return {
        element: function () {
            return el()
        },
        isEnabled: function () {
            return !el().prop("disabled")
        },
        isVisible: function () {
            return el().is(":visible")
        },
        click: function () {
            el().click()
        },
        isRealButton: function () {
            return el().prop("tagName") == "BUTTON"
        },
        hasTabIndex: function () {
            return el().prop("tabIndex") > 0
        },
        isFocusableBefore: function (button) {
            return !this.hasTabIndex() && !button.hasTabIndex() && compareDOMIndex(this.element(), button.element()) < 0
        }
    }
}

function S(selector) {
    try {
        if (!testFrame() || !testFrame().jQuery) {
            return $([])
        }
        return testFrame().jQuery(selector)
    } catch (e) {
        console.log("Premature access to testFrame.jQuery, printing stack trace.")
        console.log(new Error().stack)
        throw e
    }
}

uiUtil = {
    inputValues: function (el) {
        function formatKey(key) {
            return key.replace(".data.", ".")
        }

        function getId(el) {
            return [el.attr("ng-model"), el.attr("ng-bind")].join("")
        }

        return _.chain(el.find("[ng-model]:visible, [ng-bind]:visible"))
            .map(function (el) {
                return [formatKey(getId($(el))), $(el).val() + $(el).text()]
            })
            .object().value()
    }
}

mockAjax = {
    init: function () {
        var deferred = Q.defer()
        if (testFrame().sinon)
            deferred.resolve()
        else
            testFrame().$.getScript('test/lib/sinon-server-1.10.3.js', function () {
                deferred.resolve()
            })
        return deferred.promise
    },
    respondOnce: function (method, url, responseCode, responseBody) {
        var fakeAjax = function () {
            var xhr = sinon.useFakeXMLHttpRequest()
            xhr.useFilters = true
            xhr.addFilter(function (method, url) {
                return url != _fakeAjaxParams.url || method != _fakeAjaxParams.method
            })

            xhr.onCreate = function (request) {
                window.setTimeout(function () {
                    if (window._fakeAjaxParams && request.method == _fakeAjaxParams.method && request.url == _fakeAjaxParams.url) {
                        request.respond(_fakeAjaxParams.responseCode, {"Content-Type": "application/json"}, _fakeAjaxParams.responseBody)
                        xhr.restore()
                        delete _fakeAjaxParams
                    }
                }, 0)
            }
        }

        testFrame()._fakeAjaxParams = {
            method: method,
            url: url,
            responseCode: responseCode,
            responseBody: responseBody
        }
        testFrame().eval("(" + fakeAjax.toString() + ")()")
    }
}

util = {
    flattenObject: function (obj) {
        function flatten(obj, prefix, result) {
            _.each(obj, function (val, id) {
                if (_.isObject(val)) {
                    flatten(val, id + ".", result)
                } else {
                    result[prefix + id] = val
                }
            })
            return result
        }

        return flatten(obj, "", {})
    }
}

function getJson(url) {
    return Q($.ajax({url: url, dataType: "json"}))
}

function testFrame() {
    return $("#testframe").get(0).contentWindow;
}

function openPage(path, predicate) {
    if (!predicate) {
        console.log("nopredicate for: " + path)
        predicate = function () {
            return testFrame().jQuery
        }
    }
    return function () {
        var newTestFrame = $('<iframe/>').attr({src: path, width: 1024, height: 800, id: "testframe"})
        $("#testframe").replaceWith(newTestFrame)
        return wait.until(function () {
            testFrame().mocksOn = true
            testFrame().runTestHooks = runTestHooks
            return predicate()
        })().then(function () {
            window.uiError = null
            testFrame().onerror = function (err) {
                window.uiError = err
            } // Hack: force mocha to fail on unhandled exceptions
        })
    }
}

var testHooks = []

function addTestHook(fn) {
    if(typeof fn !== 'function') {
        throw new Error('Test hook is not a function, got typeof fn'+(typeof fn))
    }
    return function() {
        testHooks.push(fn)
    }
}

function runTestHooks() {
    testHooks.forEach(function(hook) { hook() })
    testHooks = []
}

function exists(fn) {
    if (typeof(fn) !== 'function') {
        throw new Error('exists() got a non-function')
    }
    return wait.until(function() {
        return fn().length > 0
    })
}

function typeaheadInput(inputFn, text, selectItemFn) {
    return seq(
        function() {
            dslDebug("typeahead input:",inputFn().selector, " text:", text, "item selector:", selectItemFn().selector)
        },
        visible(inputFn),
        function() { return inputFn().val(text).change()},
        click(selectItemFn)
    )
}

// Promise returning POST data triggered by triggerFn. urlPattern needs to match POST url
function mockPostReturnData(triggerFn, urlPattern) {
    var deferred = Q.defer()
    return seq(
        function () {
            var savedData
            testFrame().httpBackend.when('POST', urlPattern, function (data) {
                deferred.resolve(data)
                savedData = data
                return true
            }).respond(savedData)
        },
        triggerFn,
        function(){return deferred.promise}
    )
}

function assertText(selector, val) {
    chai.assert(typeof selector().val() !== 'undefined', "element "  + selector().selector + " should be defined, is undefined")
    expect(selector().text().trim()).to.equal(val, selector().selector)
}

function assertValue(selector, val) {
    chai.assert(typeof selector().val() !== 'undefined', "element "  + selector().selector + " should be defined, is undefined")
    expect(selector().val().trim()).to.equal(val, selector().selector)
}

function log(marker) {
    return function(arg) {
        console.log(marker, arg)
        return arg
    }
}

function takeScreenshot() {
    if (window.callPhantom) {
        var date = new Date()
        var filename = "target/screenshots/" + date.getTime()
        console.log("Taking screenshot " + filename)
        callPhantom({'screenshot': filename})
    } else {
        console.error('No screenshot saved')
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