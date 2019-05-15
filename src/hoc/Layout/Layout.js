import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';

import classes from './Layout.module.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

const Layout = (props) => {
	const [ sideDrawerIsVisible, setSideDrawerIsVisible ] = useState(false);

	const handleSideDrawerClose = () => {
		setSideDrawerIsVisible(false);
	};

	const handleDrawerToggle = () => {
		setSideDrawerIsVisible(!sideDrawerIsVisible);
	};

	return (
		<Fragment>
			<Toolbar
				isAuth={props.isAuthenticated}
				drawerToggleClicked={handleDrawerToggle}
			/>
			<SideDrawer
				isAuth={props.isAuthenticated}
				open={sideDrawerIsVisible}
				closed={handleSideDrawerClose}
			/>
			<main className={classes.Content}>{props.children}</main>
		</Fragment>
	);
};

const mapStateToProps = (state) => {
	return {
		isAuthenticated: state.auth.token !== null
	};
};

export default connect(mapStateToProps)(Layout);
