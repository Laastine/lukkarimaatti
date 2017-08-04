import React from 'react'
import {onLinkClick} from '../routes'
import Modal from './Modal'
import {appState} from '../store/lukkariStore'

class Header extends React.Component {
  constructor(props) {
    super(props)
    this.state = props.state
  }

  render() {
    return <div className='header-container'>
      <Modal state={this.props.state}/>
      <a className='header-element header-link' href='/' onClick={onLinkClick}>Lukkarimaatti++</a>
      <a id='saveModalButton' className='header-element header-element-link' onClick={() => {
        appState.dispatch({type: 'SAVE_MODAL', isModalOpen: true})
      }}>Save</a>
      <a id='catalogButton' className='header-element header-element-link' href='/catalog' onClick={onLinkClick}>Catalog</a>
    </div>
  }
}

export default Header
