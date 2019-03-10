import React, { Component } from 'react';
import axios from '../../axios-orders';

import Aux from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7
};

class BurgerBuilder extends Component {
  state = {
    ingredients: null,
    totalPrice: 4,
    purchaseable: false,
    purchasing: false,
    loading: false,
    error: false
  }

  componentDidMount() {
    axios.get('/ingredients.json')
      .then(res => {
        this.setState({ ingredients: res.data })
      })
      .catch(err => {
        this.setState({ error: true })
      });
  }

  updatePurchaseState(ingredients) {
    const sum = Object.keys(ingredients)
      .map(igKey => ingredients[igKey])
      .reduce((sum, el) => sum + el, 0);
    console.log(sum);

    this.setState({ purchaseable: sum > 0 });
  }

  handleAddIngredient = type => {
    const oldCount = this.state.ingredients[type];
    const updatedCount = oldCount + 1;
    const updatedIngredients = {
      ...this.state.ingredients
    }
    updatedIngredients[type] = updatedCount;

    const priceAddition = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice + priceAddition;
    this.setState({ totalPrice: newPrice, ingredients: updatedIngredients });
    this.updatePurchaseState(updatedIngredients);
  }

  handleRemoveIngredient = type => {
    const oldCount = this.state.ingredients[type];
    if (oldCount <= 0) return;
    const updatedCount = oldCount - 1;
    const updatedIngredients = {
      ...this.state.ingredients
    }
    updatedIngredients[type] = updatedCount;

    const priceDeduction = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice - priceDeduction;
    this.setState({ totalPrice: newPrice, ingredients: updatedIngredients });
    this.updatePurchaseState(updatedIngredients);
  }

  handlePurchase = () => {
    this.setState({ purchasing: true })
  }

  handlePurchaseCancel = () => {
    this.setState({ purchasing: false })
  }

  handlePurchaseContinue = () => {
    // alert('continue')
    this.setState({ loading: true });
    const order = {
      ingredients: this.state.ingredients,
      price: this.state.totalPrice, // this should recalculate in server
      customer: {
        name: 'Foyez Ahmed',
        address: {
          street: 'Teststreet 1',
          zipCode: '3402',
          country: 'Bangladesh'
        },
        email: 'test@test.com'
      },
      deliveryMethod: 'fastest'
    }

    axios.post('/orders.json', order)
      .then(res => {
        this.setState({ loading: false, purchasing: false });
      })
      .catch(err => {
        this.setState({ loading: false, purchasing: false });
      });
  }

  render() {
    const disabledInfo = {
      ...this.state.ingredients
    };

    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
      // console.log(disabledInfo);
    }

    let orderSummary = null;

    let burger = this.state.error ? <p>Ingredients can't be loaded!</p> : <Spinner />;
    if (this.state.ingredients) {

      burger = (
        <Aux>
          <Burger ingredients={ this.state.ingredients } />
          <BuildControls
            ingredientAdded={ this.handleAddIngredient }
            ingredientRemoved={ this.handleRemoveIngredient }
            disabled={ disabledInfo }
            purchaseable={ this.state.purchaseable }
            ordered={ this.handlePurchase }
            price={ this.state.totalPrice }
          />
        </Aux>
      );

      orderSummary = <OrderSummary
        ingredients={ this.state.ingredients }
        price={ this.state.totalPrice }
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

export default withErrorHandler(BurgerBuilder, axios);