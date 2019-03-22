import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './Auth.module.css';
import * as actions from '../../store/actions/index';

class Auth extends Component {
  state = {
    controls: {
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
    },
    isSignup: true
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

  handleInputChanged = (e, controlName) => {
    const updatedControls = {
      ...this.state.controls,
      [controlName]: {
        ...this.state.controls[controlName],
        value: e.target.value,
        valid: this.checkValidity(e.target.value, this.state.controls[controlName].validation),
        touched: true
      }
    };
    this.setState({ controls: updatedControls });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.controls.isSignup);
  }

  handleSwitchAuthMode = () => {
    this.setState(prevState => {
      return { isSignup: !prevState.isSignup };
    });
  };

  componentDidMount() {
    if (!this.props.buildingBurger && this.props.authRedirectPath !== '/') {
      this.props.onSetAuthRedirectPath();
    }
  }

  render() {
    const formElArr = [];
    for (let key in this.state.controls) {
      formElArr.push({
        id: key,
        config: this.state.controls[key]
      });
    }

    let form = formElArr.map(formEl => (
      <Input
        key={ formEl.id }
        elType={ formEl.config.elType }
        elConfig={ formEl.config.elConfig }
        value={ formEl.config.value }
        invalid={ !formEl.config.valid }
        shouldValidate={ formEl.config.validation }
        touched={ formEl.config.touched }
        changed={ (e) => this.handleInputChanged(e, formEl.id) }
      />
    ));

    if (this.props.loading) {
      form = <Spinner />;
    }

    let errorMessage = null;

    if (this.props.error) {
      errorMessage = (
        <p>{ this.props.error.message }</p>
      );
    }

    let authRedirect = null;
    if (this.props.isAuthenticated) {
      authRedirect = <Redirect to={ this.props.authRedirectPath } />;
    }

    return (
      <div className={ classes.Auth }>
        { authRedirect }
        { errorMessage }
        <form onSubmit={ this.handleSubmit }>
          { form }
          <Button btnType='Success'>SUBMIT</Button>
        </form>
        <Button
          clicked={ this.handleSwitchAuthMode }
          btnType='Danger'>SWITCH TO { this.state.isSignup ? 'SIGNIN' : 'SIGNUP' }</Button>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    isAuthenticated: state.auth.token !== null,
    buildingBurger: state.burgerBuilder.building,
    authRedirectPath: state.auth.authRedirectPath
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAuth: (email, password, isSignup) => dispatch(actions.auth(email, password, isSignup)),
    onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);