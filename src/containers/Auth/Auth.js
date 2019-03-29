import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './Auth.module.css';
import * as actions from '../../store/actions/index';
import { updateObj, checkValidity } from '../../shared/utility';

const Auth = (props) => {
	const [ authForm, setAuthForm ] = useState({
		email: {
			elType: 'input',
			elConfig: {
				type: 'email',
				placeholder: 'Your Email'
			},
			value: '',
			validation: {
				required: true,
				isEmail: true
			},
			valid: false,
			touched: false
		},
		password: {
			elType: 'input',
			elConfig: {
				type: 'password',
				placeholder: 'Your Password'
			},
			value: '',
			validation: {
				required: true,
				minLength: 6 // Also need to handle with Backend
			},
			valid: false,
			touched: false
		}
	});

	const [ isSignup, setIsSignup ] = useState(true);

	useEffect(() => {
		if (!props.buildingBurger && props.authRedirectPath !== '/') {
			props.onSetAuthRedirectPath();
		}
	}, []);

	const handleInputChanged = (e, controlName) => {
		const updatedControls = updateObj(authForm, {
			[controlName]: updateObj(authForm[controlName], {
				value: e.target.value,
				valid: checkValidity(e.target.value, authForm[controlName].validation),
				touched: true
			})
		});
		setAuthForm(updatedControls);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		props.onAuth(authForm.email.value, authForm.password.value, isSignup);
	};

	const handleSwitchAuthMode = () => {
		setIsSignup(!isSignup);
	};

	const formElArr = [];
	for (let key in authForm) {
		formElArr.push({
			id: key,
			config: authForm[key]
		});
	}

	let form = formElArr.map((formEl) => (
		<Input
			key={formEl.id}
			elType={formEl.config.elType}
			elConfig={formEl.config.elConfig}
			value={formEl.config.value}
			invalid={!formEl.config.valid}
			shouldValidate={formEl.config.validation}
			touched={formEl.config.touched}
			changed={(e) => handleInputChanged(e, formEl.id)}
		/>
	));

	if (props.loading) {
		form = <Spinner />;
	}

	let errorMessage = null;

	if (props.error) {
		errorMessage = <p>{props.error.message}</p>;
	}

	let authRedirect = null;
	if (props.isAuthenticated) {
		authRedirect = <Redirect to={props.authRedirectPath} />;
	}

	return (
		<div className={classes.Auth}>
			{authRedirect}
			{errorMessage}
			<form onSubmit={handleSubmit}>
				{form}
				<Button btnType='Success'>SUBMIT</Button>
			</form>
			<Button clicked={handleSwitchAuthMode} btnType='Danger'>
				SWITCH TO {isSignup ? 'SIGNIN' : 'SIGNUP'}
			</Button>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		loading: state.auth.loading,
		error: state.auth.error,
		isAuthenticated: state.auth.token !== null,
		buildingBurger: state.burgerBuilder.building,
		authRedirectPath: state.auth.authRedirectPath
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onAuth: (email, password, isSignup) =>
			dispatch(actions.auth(email, password, isSignup)),
		onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
