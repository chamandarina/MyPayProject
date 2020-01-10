import React, { Component, Suspense } from 'react';
import { connect } from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import './helpers/Firebase';
import AppLocale from './lang';
import ColorSwitcher from './components/common/ColorSwitcher';
import NotificationContainer from './components/common/react-notifications/NotificationContainer';
import { isMultiColorActive, isDemo } from './constants/defaultValues';
import { getDirection } from './helpers/Utils';
import { AuthService } from './helpers/IdentityServer';
import  Callback  from './components/applications/Callback.js';
import AuthRoute from './components/applications/AuthRoute.js';
import { auth } from 'firebase';

const ViewMain = React.lazy(() =>
  import(/* webpackChunkName: "views" */ './views')
);
const ViewApp = React.lazy(() =>
  import(/* webpackChunkName: "views-app" */ './views/app')
);
const ViewUser = React.lazy(() =>
  import(/* webpackChunkName: "views-user" */ './views/user')
);
const ViewError = React.lazy(() =>
  import(/* webpackChunkName: "views-error" */ './views/error')
);

class App extends Component {
  authService
  shouldCancel
  constructor(props) {
    super(props);
    const direction = getDirection();
    if (direction.isRtl) {
      document.body.classList.add('rtl');
      document.body.classList.remove('ltr');
    } else {
      document.body.classList.add('ltr');
      document.body.classList.remove('rtl');
    }

    this.state = {
      stateUser: null
    }

    this.authService = new AuthService();
    this.shouldCancel = false;
  }

  // componentDidMount() {
  //   this.getUser();
  // }

  // componentWillUnmount() {
  //   this.shouldCancel = true;
  // }

  getUser = () => {
    this.authService.getUser().then(user => {
      if (user) {
        console.log('User has been successfully loaded from store.');
        
      } else {
        console.log('You are not logged in.');
      }

      if (!this.shouldCancel) {
        this.setState({ stateUser: user });
      }

      
    });
  };

  login = () => {
    return this.authService.login();
  }

  completeLoginFunc = () => {
    return this.authService.completeLogin();
  }

  // getUser = () => {
  //   this.authService.getUser().then((res) => {
  //     return res;
  //   }).catch(() => {
  //     return null;
  //   });
  // }

  // getUser = async () => {
  //   return await this.authService.getUser().then((user) => {
  //     this.setState({ user: user })
  //   });
  // }

  render() {

 

    const { locale, user } = this.props;
    const currentAppLocale = AppLocale[locale];
 
    return (
      <div className="h-100">
        <IntlProvider
          locale={currentAppLocale.locale}
          messages={currentAppLocale.messages}
        >
          <React.Fragment>
            <NotificationContainer />
            {/* {isMultiColorActive && <ColorSwitcher />} */}
            <Suspense fallback={<div className="loading" />}>
              <Router>
                <Switch>
                  <AuthRoute
                    path="/app"
                    authUser={user}
                    component={ViewApp}
                  />
                  <Route
                    path="/callback"
                    component={Callback}
                  />
                  <Route
                    path="/user"
                    render={props => <ViewUser {...props} />}
                  />
                  <Route
                    path="/error"
                    exact
                    render={props => <ViewError {...props} />}
                  />
                  <Route
                    path="/"
                    exact
                    render={props => <ViewMain {...props} />}
                  />
                  <Redirect to="/error" />
                </Switch>
              </Router>
            </Suspense>
          </React.Fragment>
        </IntlProvider>
      </div>
    );
  }
}

const mapStateToProps = ({ authUser, settings }) => {
  const { user } = authUser;
  const { locale } = settings;
  return { user, locale };
};
const mapActionsToProps = {};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(App);
