function lukkarimaattiPage() {
    var lukkarimaattiPage = openPage("/", function () {
        return S("#searchbar").length === 1
    })

    var pageFunctions = {

        searchbar: function () {
            return S("#searchbar")
        },

        openPage: function (done) {
            return lukkarimaattiPage()
                .then(wait.until(function () {
                    var pageReady = pageFunctions.searchbar().length === 1
                    if (pageReady) {
                        done()
                    }
                    return pageReady
                }))
        }
    }
    return pageFunctions
}

selectors = initSelectors({
    aboutModal: "#aboutModalButton",
    aboutClose: "#aboutClose",
    indexPage: "a:contains('Lukkarimaatti++')",
    saveModal: "#saveModalButton",
    saveClose: "#saveClose",
    calendarNavi: function (text) {
        return "button:contains('" + text + "')"
    },
    calendarView: function (text) {
        return ".fc-" + text + "-view"
    }
})