describe('Lukkarimaatti UI navigation', function () {
  var page = LukkarimaattiPage();
  before(function () {
    return page.openPage(function () {
      const el = testFrame().document.getElementsByClassName('rbc-calendar')
      return el && el.length > 0;
    }, '')
  })

  it('Test link navigation', function (done) {
    waitUntil(function () {
      return $(S('.rbc-calendar')[0]).is(':visible')
    }, 3000)()
      .then(click('.header-element', 2))
      .then(function () {
        expect($(S('.department-link-container')[0]).is(':visible')).to.equal(true)
      })
      .then(click('.header-element', 0))
      .then(function () {
        expect($(S('.rbc-calendar')[0]).is(':visible')).to.equal(true)
        done()
      })
  })

  it('Test browser navigation', function (done) {
    waitUntil(function () {
      return $(S('.rbc-calendar')[0]).is(':visible')
    }, 3000)()
      .then(click('.header-element', 2))
      .then(function () {
        expect($(S('.department-link-container')[0]).is(':visible')).to.equal(true)
      })
      .then(browserBack())
      .then(waitUntil(function () {
        return $(S('.rbc-calendar')[0]).is(':visible')
      }, 3000))
      .then(function () {
        expect($(S('.rbc-calendar')[0]).is(':visible')).to.equal(true)
        done()
      })
  })

  it('Test search autocomplete', function (done) {
    waitUntil(function () {
      return $(S('.rbc-calendar')[0]).is(':visible')
    }, 3000)()
      .then(setInputValue('#course-searchbox', 0, 'olio-ohjel'))
      .then(waitUntil(function () {
        return $(S('.search-list-coursename')[0]).is(':visible')
      }, 3000))
      .then(function () {
        expect($(S('.search-list-coursename')).is(':visible')).to.equal(true)
        expect($(S('.search-list-coursename')).text()).to.equal('Olio-ohjelmointi')
        done()
      })
  })

  it('Test url params selected courses', function (done) {
    waitUntil(function () {
      return page.openPage(function () {
        const el = testFrame().document.getElementsByClassName('rbc-calendar')
        return el && el.length > 0;
      }, 'http://localhost:8080/?courses=BL20A1600+CT60A2411')
    })()
      .then(waitUntil(function () {
        return $(S('.selected-courses-list')[0]).is(':visible')
      }, 3000))
      .then(function () {
        var selectedCourses = S('.selected-courses-list .search-list-element').map(function (e) {
          return e.textContent
        })
        expect(selectedCourses.some(function (e) {
          return e === 'CT60A2411 - Olio-ohjelmointiX'
        })).to.equal(true)
        expect(selectedCourses.some(function (e) {
          return e === 'BL20A1600 - Smart GridsX'
        })).to.equal(true)
        done()
      })
  })
})