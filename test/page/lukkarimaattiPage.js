function LukkarimaattiPage() {
  return {
    openPage: function(pageLoadedCheck) {
      return loadPage('http://localhost:8080/', pageLoadedCheck);
    }
  };
}