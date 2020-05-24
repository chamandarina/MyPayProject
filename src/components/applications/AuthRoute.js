import React, { Component, Suspense } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { AuthService } from '../../helpers/IdentityServer';
import { fetchCustomer } from '../../redux/reporting/actions';
import jwt from 'jsonwebtoken';

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
    if (authUser) {
      const user = jwt.decode(authUser.access_token);
      if (!this.props.customer) {
        this.props.fetchCustomer(user.sub);
      }
      return ( <Route {...rest} render={props => ( <Component {...props} /> )} /> )
    } else {
      return <div className="loading"></div>;
    }
  }
}

const mapStateToProps = (state) => {
  const { customer } = state.reporting;
  return { customer };
};

export default connect(mapStateToProps, { fetchCustomer })(AuthRoute);