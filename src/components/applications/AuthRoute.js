import React, { Component, Suspense } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { AuthService } from '../../helpers/IdentityServer';

class AuthRoute extends Component {
  authService
  constructor(props) {
    super(props);

  this.state = {
    currentUser: null
  }

    this.authService = new AuthService();

  }

  componentDidMount() {
    this.authService.getUser().then(user => {
      if (!user) {
        this.authService.login();
      } else {
        this.setState({ currentUser: user });
      }
    });    
  }

  render() {
    const { component: Component, ...rest } = this.props;
    const authUser = this.state.currentUser == null ? this.authService.getCurrentUser() : this.state.currentUser;
    console.log(authUser, 'yeah mada faka')
    if (authUser) {
      return ( <Route {...rest} render={props => ( <Component {...props} /> )} /> )
    } else {
      return <div className="loading"></div>;
    }
  }
}

export default AuthRoute;