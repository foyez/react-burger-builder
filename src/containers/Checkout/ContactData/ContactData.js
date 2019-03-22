import React, { Component } from 'react';
import { connect } from 'react-redux';

import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import classes from './ContactData.module.css';
import axios from '../../../axios-orders';
import Input from '../../../components/UI/Input/Input';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions/index';

class ContactData extends Component {
  state = {
    orderForm: {
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
          required: true
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
    },
    formIsValid: false
  }

  handleOrder = (e) => {
    e.preventDefault();

    const formData = {};
    for (let formElIdentifier in this.state.orderForm) {
      formData[formElIdentifier] = this.state.orderForm[formElIdentifier].value.trim();
    }
    console.log(formData);

    const order = {
      ingredients: this.props.ings,
      price: this.props.price.toFixed(2), // this should recalculate in server
      orderData: formData,
      userId: this.props.userId
    }

    this.props.onOrderBurger(order, this.props.token);
  }

  checkValidity(value, rules) {
    let isValid = true;

    // if(!rules) {
    //   return true;
    // }

    if (rules.required) {
      isValid = value.trim() !== '' && isValid;
    }

    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid;
    }

    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid;
    }

    if (rules.isEmail) {
      const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
      isValid = pattern.test(value) && isValid
    }

    if (rules.isNumeric) {
      const pattern = /^\d+$/;
      isValid = pattern.test(value) && isValid
    }

    return isValid;
  }

  handleInputChanged = (e, inputIdentifier) => {
    const updatedOrderForm = {
      ...this.state.orderForm
    };
    const updatedFormEl = {
      ...updatedOrderForm[inputIdentifier]
    };
    updatedFormEl.value = e.target.value;
    updatedFormEl.valid = this.checkValidity(updatedFormEl.value, updatedFormEl.validation);
    updatedFormEl.touched = true;
    updatedOrderForm[inputIdentifier] = updatedFormEl;

    let formIsValid = true;
    for (let inputIdentifier in updatedOrderForm) {
      formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
    }


    this.setState({
      orderForm: updatedOrderForm,
      formIsValid: formIsValid
    });
  }

  render() {
    const formElArr = [];
    for (let key in this.state.orderForm) {
      formElArr.push({
        id: key,
        config: this.state.orderForm[key]
      });
    }

    let form = (
      <form onSubmit={ this.handleOrder }>
        {
          formElArr.map(formEl => (
            <Input
              key={ formEl.id }
              elType={ formEl.config.elType }
              elConfig={ formEl.config.elConfig }
              value={ formEl.config.value }
              invalid={ !formEl.config.valid }
              shouldValidate={ formEl.config.validation }
              touched={ formEl.config.touched }
              changed={ (e) => this.handleInputChanged(e, formEl.id) } />
          ))
        }
        <Button
          btnType='Success'
          disabled={ !this.state.formIsValid }
        >ORDER</Button>
      </form>
    );
    if (this.props.loading) {
      form = <Spinner />;
    }

    return (
      <div className={ classes.ContactData }>
        <h4>Enter your Contact Data</h4>
        { form }
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    loading: state.order.loading,
    token: state.auth.token,
    userId: state.auth.userId
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onOrderBurger: (orderData, token) => dispatch(actions.purchaseBurger(orderData, token))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));