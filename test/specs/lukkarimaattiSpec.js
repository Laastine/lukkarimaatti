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
    })()
      .then(click('.header-element', 2))
      .then(function () {
        expect($(S('.deparment-link-container')[0]).is(':visible')).to.equal(true)
      })
      .then(click('.header-element', 0))
      .then(function () {
        expect($(S('.rbc-calendar')[0]).is(':visible')).to.equal(true)
        done()
      })
  })

})