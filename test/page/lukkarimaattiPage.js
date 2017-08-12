function LukkarimaattiPage() {
  return {
    openPage: function(pageLoadedCheckFn, url) {
      var addr = url ? url : 'http://localhost:8080/'
      return loadPage(addr, pageLoadedCheckFn)
    }
  }
}