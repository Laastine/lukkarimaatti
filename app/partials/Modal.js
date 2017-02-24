import React from 'react'
import {appState} from '../store/lukkariStore'

const sendButton = (waitingAjax) => waitingAjax ?
  <img className='modal-ajax-spinner' src='/spinner.gif'/> :
  <button type='button' id='saveId' className='modal-button' data-dismiss='modal'
          onClick={(e) => {
            appState.dispatch({
              type: 'SEND_EMAIL',
              waitingAjax: true,
              email: e.target.previousElementSibling.value
            })
          }}>
    Send
  </button>

class Modal extends React.Component {
  render() {
    const {isModalOpen, waitingAjax} = this.props.state

    return isModalOpen ? <div className='modal-dialog'>
        <div>
          <div id='saveClose' onClick={() => {appState.dispatch({type: 'SAVE_MODAL', isModalOpen: false})}}
               className='close'>X
          </div>
          <div>Send course selection URL to your email.</div>
          <form className='modal-input-container'>
            <input type='email' className='modal-input' id='saveEmail' placeholder='Email' autoFocus="true"/>
            {sendButton(waitingAjax)}
          </form>
        </div>
      </div> : null
  }
}

export default Modal
