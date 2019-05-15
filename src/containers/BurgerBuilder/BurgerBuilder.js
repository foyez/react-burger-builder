import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';

import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';
import * as actions from '../../store/actions/index';

const BurgerBuilder = (props) => {
	const [ purchasing, setPusrchasing ] = useState(false);

	useEffect(() => {
		props.onInitIngredients();
	}, []);

	const updatePurchaseState = (ingredients) => {
		const sum = Object.keys(ingredients)
			.map((igKey) => ingredients[igKey])
			.reduce((sum, el) => sum + el, 0);

		return sum > 0;
	};

	const handlePurchase = () => {
		if (props.isAuthenticated) {
			setPusrchasing(true);
		} else {
			props.onSetAuthRedirectPath('/checkout');
			props.history.push('/auth');
		}
	};

	const handlePurchaseCancel = () => {
		setPusrchasing(false);
	};

	const handlePurchaseContinue = () => {
		props.onInitPurchase();
		props.history.push('/checkout');
	};

	const disabledInfo = {
		...props.ings
	};

	for (let key in disabledInfo) {
		disabledInfo[key] = disabledInfo[key] <= 0;
	}

	let orderSummary = null;

	let burger = props.error ? <p>Ingredients can't be loaded!</p> : <Spinner />;
	if (props.ings) {
		burger = (
			<Fragment>
				<Burger ingredients={props.ings} />
				<BuildControls
					ingredientAdded={props.onIngredientAdded}
					ingredientRemoved={props.onIngredientRemoved}
					disabled={disabledInfo}
					purchaseable={updatePurchaseState(props.ings)}
					ordered={handlePurchase}
					price={props.price}
					isAuth={props.isAuthenticated}
				/>
			</Fragment>
		);

		orderSummary = (
			<OrderSummary
				ingredients={props.ings}
				price={props.price}
				purchaseCancelled={handlePurchaseCancel}
				purchaseContinued={handlePurchaseContinue}
			/>
		);
	}

	return (
		<Fragment>
			<Modal show={purchasing} modalClosed={handlePurchaseCancel}>
				{orderSummary}
			</Modal>
			{burger}
		</Fragment>
	);
};

const mapStateToProps = (state) => {
	return {
		ings: state.burgerBuilder.ingredients,
		price: state.burgerBuilder.totalPrice,
		error: state.burgerBuilder.error,
		isAuthenticated: state.auth.token !== null
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
		onIngredientRemoved: (ingName) =>
			dispatch(actions.removeIngredient(ingName)),
		onInitIngredients: () => dispatch(actions.initIngredients()),
		onInitPurchase: () => dispatch(actions.purchaseInit()),
		onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(
	withErrorHandler(BurgerBuilder, axios)
);
