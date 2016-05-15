describe('Lukkarimaatti UI navigation', function () {
  var page
  before(function () {
    page = LukkarimaattiPage();
    return page.openPage(function () {
      const el = testFrame().document.getElementsByClassName('container')
      return el && el.length > 0;
    })
  })

  it('Test navigation', function (done) {
    waitUntil(monkeyPatchBrowserAPI('button#button-month').isVisible)()
      .then(click('button#button-month'))
      .then(function () {
        expect(S('.rbc-active').text()).to.equal('month')
        expect(monkeyPatchBrowserAPI('.rbc-month-header').isVisible()).to.equal(true)
      })
      .then(click('button#button-day'))
      .then(function() {
        expect(S('.rbc-active').text()).to.equal('day')
        done()
      })
  })

  
})