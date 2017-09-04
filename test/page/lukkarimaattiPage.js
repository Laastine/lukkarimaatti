/* global loadPage */

function LukkarimaattiPage() { // eslint-disable-line no-unused-vars
  return {
    openPage: (pageLoadedCheckFn, url) => {
      const addr = url ? url : 'http://localhost:8080/'
      return loadPage(addr, pageLoadedCheckFn)
    }
  }
}
