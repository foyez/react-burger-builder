import React, { useState } from 'react';
import { connect } from 'react-redux';

import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import classes from './ContactData.module.css';
import axios from '../../../axios-orders';
import Input from '../../../components/UI/Input/Input';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions/index';
import { updateObj, checkValidity } from '../../../shared/utility';

const ContactData = (props) => {
	const [ orderForm, setOrderForm ] = useState({
		name: {
			elType: 'input',
			elConfig: {
				type: 'text',
				placeholder: 'Your Name'
			},
			value: '',
			validation: {
				required: true
			},
			valid: false,
			touched: false
		},
		street: {
			elType: 'input',
			elConfig: {
				type: 'text',
				placeholder: 'Street'
			},
			value: '',
			validation: {
				required: true
			},
			valid: false,
			touched: false
		},
		zipCode: {
			elType: 'input',
			elConfig: {
				type: 'text',
				placeholder: 'ZIP Code'
			},
			value: '',
			validation: {
				required: true,
				minLength: 4,
				maxLength: 5
			},
			valid: false,
			touched: false
		},
		country: {
			elType: 'input',
			elConfig: {
				type: 'text',
				placeholder: 'Country'
			},
			value: '',
			validation: {
				required: true
			},
			valid: false,
			touched: false
		},
		email: {
			elType: 'input',
			elConfig: {
				type: 'email',
				placeholder: 'Your E-Mail'
			},
			value: '',
			validation: {
				required: true,
				isEmail: true
			},
			valid: false,
			touched: false
		},
		deliveryMethod: {
			elType: 'select',
			elConfig: {
				options: [
					{ value: 'fastest', displayValue: 'Fastest' },
					{ value: 'cheapest', displayValue: 'Cheapest' }
				]
			},
			value: 'fastest',
			validation: {},
			valid: true
		}
	});

	const [ formIsValid, setFormIsValid ] = useState(false);

	const handleOrder = (e) => {
		e.preventDefault();

		const formData = {};
		for (let formElIdentifier in orderForm) {
			formData[formElIdentifier] = orderForm[formElIdentifier].value.trim();
		}
		console.log(formData);

		const order = {
			ingredients: props.ings,
			price: props.price.toFixed(2), // this should recalculate in server
			orderData: formData,
			userId: props.userId
		};

		props.onOrderBurger(order, props.token);
	};

	const handleInputChanged = (e, inputIdentifier) => {
		const updatedFormEl = updateObj(orderForm[inputIdentifier], {
			value: e.target.value,
			valid: checkValidity(
				e.target.value,
				orderForm[inputIdentifier].validation
			),
			touched: true
		});
		const updatedOrderForm = updateObj(orderForm, {
			[inputIdentifier]: updatedFormEl
		});

		let formIsValid = true;
		for (let inputIdentifier in updatedOrderForm) {
			formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
		}

		setOrderForm(updatedOrderForm);
		setFormIsValid(formIsValid);
	};

	const formElArr = [];
	for (let key in orderForm) {
		formElArr.push({
			id: key,
			config: orderForm[key]
		});
	}

	let form = (
		<form onSubmit={handleOrder}>
			{formElArr.map((formEl) => (
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
			))}
			<Button btnType='Success' disabled={!formIsValid}>
				ORDER
			</Button>
		</form>
	);
	if (props.loading) {
		form = <Spinner />;
	}

	return (
		<div className={classes.ContactData}>
			<h4>Enter your Contact Data</h4>
			{form}
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		ings: state.burgerBuilder.ingredients,
		price: state.burgerBuilder.totalPrice,
		loading: state.order.loading,
		token: state.auth.token,
		userId: state.auth.userId
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onOrderBurger: (orderData, token) =>
			dispatch(actions.purchaseBurger(orderData, token))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(
	withErrorHandler(ContactData, axios)
);
