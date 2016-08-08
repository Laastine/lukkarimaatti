import React from 'react'

const NotFoundPage = React.createClass({
  statics: {
    needs: []
  },

  contextTypes: {
    appState: React.PropTypes.object
  },

  render() {
    return <div className='no-match-container'>
      <pre className='no-match-ascii'>.____           __    __                 .__                       __    __  .__
        |    |    __ __|  | _|  | _______ _______|__| _____ _____  _____ _/  |__/  |_|__|
        |    |   |  |  \  |/ /  |/ /\__  \\_  __ \  |/     \\__  \ \__  \\   __\   __\  |
        |    |___|  |  /    &lt;|    &lt;  / __ \|  | \/  |  Y Y  \/ __ \_/ __ \|  |  |  | |  |
        |_______ \____/|__|_ \__|_ \(____  /__|  |__|__|_|  (____  (____  /__|  |__| |__|
        \/          \/    \/     \/               \/     \/     \/</pre>
      <div className='no-match'>404 Page Not Found.</div>
      <a className='no-match-link' href='/'>Go to lukkarimaatti</a>
    </div>
  }
})

export default NotFoundPage
