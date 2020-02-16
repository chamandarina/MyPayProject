import React, { Component, Suspense } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { AuthService } from '../../helpers/IdentityServer';

class AuthRoute extends Component {
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
    const { component: Component, user, ...rest } = this.props;
    // if (!user) {
    //   return <Suspense fallback={<div className="loading" />}></Suspense>
    // } else {
      return ( <Route {...rest} render={props => ( <Component {...props} /> )} /> )
    
  }
}

const mapStateToProps = ({ authUser }) => {
  const { user } = authUser;
  return { user };
};

export default connect(mapStateToProps)(AuthRoute);