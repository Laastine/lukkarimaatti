import React from 'react'

export default (applicationState, emailBus) => {
    const url = applicationState.urlParams
    const sendButton = applicationState.waitingAjax ?
        <img className="modal-ajax-spinner" src="/spinner.gif"/>
        :
        <button type="button" id="saveId" className="modal-button" data-dismiss="modal"
                onClick={(e) => {emailBus.push({address: e.target.previousElementSibling.value, url, isModalOpen: true})}}>
            Send
        </button>
    const modal = applicationState.isModalOpen ? <div className="modal-dialog">
        <div>
            <div onClick={() => {emailBus.push({isModalOpen: false})}} className="close">X
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
        <a className="header-element header-save" onClick={() => emailBus.push({isModalOpen: true})}>Save</a>
    </div>
}