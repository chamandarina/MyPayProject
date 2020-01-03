import React, { Component, Suspense } from 'react';
import { Route } from 'react-router-dom';
import { AuthService } from '../../helpers/IdentityServer';

export class AuthRoute extends Component {
  authService

  constructor(props) {
    super(props);

    this.authService = new AuthService();

  }

  componentDidMount() {
    if (!this.props.user) {
      this.authService.login();
    }
  }

  render() {
    const { component: Component, ...rest } = this.props;

    if (!this.props.user) {
      return <Suspense fallback={<div className="loading" />}></Suspense>
    } else {
      return ( <Route {...rest} render={props => ( <Component {...props} /> )} /> )
    }
  }
}