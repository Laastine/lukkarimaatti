describe('Lukkarimaatti UI navigation', function () {
  var page
  before(function () {
    page = LukkarimaattiPage();
    return page.openPage(function () {
      const el = testFrame().document.getElementsByClassName('container')
      return el && el.length > 0;
    })
  })

  it('Test save modal', function (done) {
    waitUntil(monkeyPatchBrowserAPI("button#button-month").isVisible)()
      .then(monkeyPatchBrowserAPI("button#button-month").click())
      .then(function () {
        expect(monkeyPatchBrowserAPI('.rbc-active').text()).to.equal('month')
        done()
      })
  })
})