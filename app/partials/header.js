import React from 'react'
import {Link} from 'react-router'
import {appState} from '../store/lukkariStore' // eslint-disable-line

class Header extends React.Component {
  render() {
    const {isModalOpen, waitingAjax} = this.props.state
    const sendButton = waitingAjax ?
      <img className='modal-ajax-spinner' src='/spinner.gif'/> :
      <button type='button' id='saveId' className='modal-button' data-dismiss='modal'
              onClick={(e) => {
                appState.dispatch({
                  type: 'SEND_EMAIL',
                  waitingAjax: true,
                  email: e.target.previousElementSibling.value,
                  url: ''
                })
              }}>
        Send
      </button>
    const modal = isModalOpen ? <div className='modal-dialog'>
      <div>
        <div id='saveClose' onClick={() => {
          appState.dispatch({type: 'SAVE_MODAL', isModalOpen: false})
        }} className='close'>X
        </div>
        <div>Send course selection URL to your email.</div>
        <form className='modal-input-container'>
          <input type='email' className='modal-input' id='saveEmail' placeholder='Email'/>
          {sendButton}
        </form>
      </div>
    </div> : null
    return <div className='header-container'>
      {modal}
      <Link className='header-element header-link' to={'/'}>Lukkarimaatti++</Link>
      <a id='saveModalButton' className='header-element header-element-link' onClick={() => {
        appState.dispatch({type: 'SAVE_MODAL', isModalOpen: true})
      }}>Save</a>
      <Link id='catalogButton' className='header-element header-element-link' to={'/catalog'}>Catalog</Link>
    </div>
  }
}

export default Header
