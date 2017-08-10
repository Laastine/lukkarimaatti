import React from 'react'
import PropTypes from 'prop-types'
import {onLinkClick} from '../routes'
import Modal from './Modal'
import {appState} from '../store/lukkariStore'

class Header extends React.Component {
  render() {
    return <div className='header-container'>
      <Modal state={this.props.state}/>
      <a className='header-element header-link' href='/' onClick={onLinkClick}>Lukkarimaatti++</a>
      <a id='saveModalButton' className='header-element header-element-link' onClick={() => {
        appState.dispatch({type: 'SAVE_MODAL', isModalOpen: true})
      }}>Save
      </a>
      <a id='catalogButton' className='header-element header-element-link' href='/catalog' onClick={onLinkClick}>Catalog</a>
    </div>
  }
}

Header.displayName = 'Header'

Header.propTypes = {
  state: PropTypes.object
}

export default Header
