describe('Lukkarimaatti UI navigation', function () {
  before(function () {
    var page = LukkarimaattiPage();
    return page.openPage(function () {
      const el = testFrame().document.getElementsByClassName('rbc-calendar')
      return el && el.length > 0;
    })
  })

  it('Test navigation', function (done) {
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

  it('Test search autocomplete', function (done) {
    waitUntil(function () {
      return $(S('.rbc-calendar')[0]).is(':visible')
    }, 3000)()
      .then(setInputValue('#course-searchbox', 0, 'olio'))
      .then(waitUntil(function () {
        return $(S('.search-list-coursename')[0]).is(':visible')
      }, 3000))
      .then(function () {
        expect($(S('.search-list-coursename')).is(':visible')).to.equal(true)
        expect($(S('.search-list-coursename')).text()).to.equal('Olio-ohjelmointi')
        done()
      })
  })
})