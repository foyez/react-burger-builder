import React, { Component } from 'react';

import Aux from '../Auxiliary/Auxiliary';
import classes from './Layout.module.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

class Layout extends Component {
  state = {
    showSideDrawer: false
  }

  handleSideDrawerClose = () => {
    this.setState({ showSideDrawer: false })
  }

  handleDrawerToggle = () => {
    this.setState(prevState => {
      return { showSideDrawer: !prevState.showSideDrawer };
    });
  }

  render() {
    return (
      <Aux>
        <Toolbar drawerToggleClicked={ this.handleDrawerToggle } />
        <SideDrawer
          open={ this.state.showSideDrawer }
          closed={ this.handleSideDrawerClose } />
        <main className={ classes.Content }>
          { this.props.children }
        </main>
      </Aux>
    )
  }
}

export default Layout;