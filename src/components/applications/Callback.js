import React, { Suspense } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { AuthService } from '../../helpers/IdentityServer';
import {
  setUser
} from "../../redux/auth/actions";


class Callback extends React.Component {
  authService
  constructor(props) {
    super(props);

    this.state = {
      user: null
    }

    this.authService = new AuthService();
  }

  componentDidMount() {
    if (!this.state.user)
        this.authService.completeLogin().then((user) => {
        if (user) {
          this.props.setUser(user);
        }
      }).catch((error) => {
        console.log(error, 'greska')
      })
    }

  render() {
    const { user } = this.props;
    if (!user) {
      return <Suspense fallback={<div className="loading" />}></Suspense>
    } else {
      console.log(this.state.user, 'useric')
      return ( <Suspense fallback={<div className="loading" />}>  <Redirect to={{ pathname: '/' }} /> </Suspense> )
    }
  }

}

const mapStateToProps = ({ authUser }) => {
  const { user } = authUser;
  return { user };
};


export default connect(mapStateToProps, { setUser })(Callback);