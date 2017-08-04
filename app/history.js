import {isServer} from './utils'
import {appState} from './store/lukkariStore'
import {createBrowserHistory, createMemoryHistory} from 'history'

const history = isServer ? createMemoryHistory() : createBrowserHistory()

const unblock = history.block(() => {
  if (!isServer) {
    appState.dispatch({type: 'SYNC_URL_PARAMS'})
  }
})

unblock()

export default history
