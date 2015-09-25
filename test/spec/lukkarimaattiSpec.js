function asyncPrint(s) {
    return function () {
        console.log(s)
    }
}

describe('Lukkarimaatti', function () {
    var page = lukkarimaattiPage()
    beforeEach(function (done) {
        page.openPage(done)
    })
    it("About modal", seqDone(
        click(selectors.aboutModal),
        visible(selectors.aboutClose),
        function () {
            expect(selectors.aboutClose().is(':visible')).to.equal(true)
            selectors.aboutClose().click()
        }
    ))
    it("Save modal", seqDone(
        click(selectors.saveModal),
        visible(selectors.saveClose),
        function () {
            expect(selectors.saveClose().is(':visible')).to.equal(true)
            selectors.saveClose().click()
        }
    ))
    it("Calendar navi", seqDone(
        click(selectors.calendarNavi("day")),
        function () {
            expect(selectors.calendarView("agendaDay")().is(":visible")).to.equal(true)
        },
        click(selectors.calendarNavi("week")),
        function () {
            expect(selectors.calendarView("agendaWeek")().is(":visible")).to.equal(true)
        },
        click(selectors.calendarNavi("month")),
        function () {
            expect(selectors.calendarView("month")().is(":visible")).to.equal(true)
        }
    ))

})
