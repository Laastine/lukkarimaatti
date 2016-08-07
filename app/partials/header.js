import React from "react"
import {appState} from "../store/lukkariStore"

export default (state) => {
  const url = state.urlParams
  const sendButton = state.waitingAjax ?
    <img className="modal-ajax-spinner" src="/spinner.gif"/>
    :
    <button type="button" id="saveId" className="modal-button" data-dismiss="modal"
            onClick={(e) => {
              console.log('EMAIL not implemented')
              //emailBus.push({address: e.target.previousElementSibling.value, url, isModalOpen: true})
            }}>
      Send
    </button>
  const modal = state.isModalOpen ? <div className="modal-dialog">
    <div>
      <div id="saveClose" onClick={() => {
        appState.dispatch({type: 'SAVE_MODAL', isModalOpen: false})
      }} className="close">X
      </div>
      <div>Send course selection URL to your email.</div>
      <form className="modal-input-container">
        <input type="email" className="modal-input" id="saveEmail" placeholder="Email"/>
        {sendButton}
      </form>
    </div>
  </div> : undefined
  return <div className="header-container">
    {modal}
    <a className="header-element header-link" href="/">Lukkarimaatti++</a>
    <a id="saveModalButton" className="header-element header-save" onClick={() => {
      appState.dispatch({type: 'SAVE_MODAL', isModalOpen: true})
    }}>Save</a>
  </div>
}