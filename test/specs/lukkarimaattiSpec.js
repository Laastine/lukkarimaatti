describe('Turboshop UI navigation', function () {
  before(function () {
    const page = LukkarimaattiPage();
    return page.openPage(function () {
      const el = testFrame().document.getElementsByClassName('container')
      return el && el.length > 0;
    })
  })

  it('Test page loads correctly', function (done) {
    expect(true).to.equal(true)
    done()
  })
})