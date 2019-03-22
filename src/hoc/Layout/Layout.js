import React, { Component } from 'react';
import { connect } from 'react-redux';

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
        <Toolbar
          isAuth={ this.props.isAuthenticated }
          drawerToggleClicked={ this.handleDrawerToggle } />
        <SideDrawer
          isAuth={ this.props.isAuthenticated }
          open={ this.state.showSideDrawer }
          closed={ this.handleSideDrawerClose } />
        <main className={ classes.Content }>
          { this.props.children }
        </main>
      </Aux>
    )
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  };
};

export default connect(mapStateToProps)(Layout);