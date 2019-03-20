import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from './ContactData/ContactData';

class Checkout extends Component {

  handleCheckoutCancelled = () => {
    this.props.history.goBack();
  }

  handleCheckoutContinued = () => {
    this.props.history.replace('/checkout/contact-data');
  }

  render() {
    let summary = <Redirect to='/' />;
    if (this.props.ings) {
      const purchasedRedirect = this.props.purchased ? <Redirect to='/' /> : null;

      summary = (
        <div>
          { purchasedRedirect }
          <CheckoutSummary
            ingredients={ this.props.ings }
            checkoutCancelled={ this.handleCheckoutCancelled }
            checkoutContinued={ this.handleCheckoutContinued } />
          <Route
            path={ this.props.match.path + '/contact-data' }
            component={ ContactData }
          />
        </div>
      );
    }
    return summary;
  }
}

const mapStateToProps = state => {
  return {
    ings: state.burgerBuilder.ingredients,
    purchased: state.order.purchased
  };
};

export default connect(mapStateToProps)(Checkout);