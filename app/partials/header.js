import React from 'react'
import {Link} from 'react-router'
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
      <Link className='header-element header-link' to={'/'}>Lukkarimaatti++</Link>
      <a id='saveModalButton' className='header-element header-element-link' onClick={() => {
        appState.dispatch({type: 'SAVE_MODAL', isModalOpen: true})
      }}>Save</a>
      <Link id='catalogButton' className='header-element header-element-link' to={'/catalog'}>Catalog</Link>
    </div>
  }
}

export default Header
