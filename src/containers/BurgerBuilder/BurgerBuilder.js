import React, { Component } from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';
import * as actionTypes from '../../store/actions/actions';

class BurgerBuilder extends Component {
  state = {
    purchasing: false,
    loading: false,
    error: false
  }

  componentDidMount() {
    console.log(this.props);
    // axios.get('/ingredients.json')
    //   .then(res => {
    //     this.setState({ ingredients: res.data })
    //   })
    //   .catch(err => {
    //     this.setState({ error: true })
    //   });
  }

  updatePurchaseState(ingredients) {
    const sum = Object.keys(ingredients)
      .map(igKey => ingredients[igKey])
      .reduce((sum, el) => sum + el, 0);

    return sum > 0;
  }

  handlePurchase = () => {
    this.setState({ purchasing: true })
  }

  handlePurchaseCancel = () => {
    this.setState({ purchasing: false })
  }

  handlePurchaseContinue = () => {
    this.props.history.push('/checkout');
  }

  render() {
    const disabledInfo = {
      ...this.props.ings
    };

    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
      // console.log(disabledInfo);
    }

    let orderSummary = null;

    let burger = this.state.error ? <p>Ingredients can't be loaded!</p> : <Spinner />;
    if (this.props.ings) {

      burger = (
        <Aux>
          <Burger ingredients={ this.props.ings } />
          <BuildControls
            ingredientAdded={ this.props.onIngredientAdded }
            ingredientRemoved={ this.props.onIngredientRemoved }
            disabled={ disabledInfo }
            purchaseable={ this.updatePurchaseState(this.props.ings) }
            ordered={ this.handlePurchase }
            price={ this.props.price }
          />
        </Aux>
      );

      orderSummary = <OrderSummary
        ingredients={ this.props.ings }
        price={ this.props.price }
        purchaseCancelled={ this.handlePurchaseCancel }
        purchaseContinued={ this.handlePurchaseContinue } />;

      if (this.state.loading) {
        orderSummary = <Spinner />;
      }
    }

    return (
      <Aux>
        <Modal show={ this.state.purchasing } modalClosed={ this.handlePurchaseCancel }>
          { orderSummary }
        </Modal>
        { burger }
      </Aux>
    )
  }
}

const mapStateToProps = state => {
  return {
    ings: state.ingredients,
    price: state.totalPrice
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onIngredientAdded: (ingName) => dispatch({ type: actionTypes.ADD_INGREDIENT, ingredientName: ingName }),
    onIngredientRemoved: (ingName) => dispatch({ type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName }),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));