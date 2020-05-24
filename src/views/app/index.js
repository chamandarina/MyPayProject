import React, { Component, Suspense } from 'react';
import { Route, withRouter, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import AppLayout from '../../layout/AppLayout';

const Gogo = React.lazy(() =>
  import(/* webpackChunkName: "viwes-gogo" */ './gogo')
);
const Transaction = React.lazy(() =>
  import(/* webpackChunkName: "viwes-second-menu" */ './transaction')
);
const Loan = React.lazy(() =>
  import(/* webpackChunkName: "viwes-blank-page" */ './loan')
);

const Transactions = React.lazy(() =>
  import(/* webpackChunkName: "viwes-blank-page" */ './transactions')
);

const Loans = React.lazy(() =>
  import(/* webpackChunkName: "viwes-blank-page" */ './loans')
);

const Support = React.lazy(() =>
  import(/* webpackChunkName: "viwes-blank-page" */ './support')
);

const Account = React.lazy(() =>
  import(/* webpackChunkName: "viwes-blank-page" */ './account')
);


class App extends Component {
  render() {
    const { match } = this.props;

    return (
      <AppLayout>
        <div className="dashboard-wrapper">
          <Suspense fallback={<div className="loading" />}>
            <Switch>
              <Redirect exact from={`${match.url}/`} to={`${match.url}/gogo`} />
              <Route
                path={`${match.url}/gogo`}
                render={props => <Gogo {...props} />}
              />
              <Route
                path={`${match.url}/transaction`}
                render={props => <Transaction {...props} />}
              />
              <Route
                path={`${match.url}/loan`}
                render={props => <Loan {...props} />}
              />
              <Route
                path={`${match.url}/transactions`}
                render={props => <Transactions {...props} />}
              />
              <Route
                path={`${match.url}/loans`}
                render={props => <Loans {...props} />}
              />
              <Route
                path={`${match.url}/support`}
                render={props => <Support {...props} />}
              />
              <Route
                path={`${match.url}/account`}
                render={props => <Account {...props} />}
              />
              <Redirect to="/error" />
            </Switch>
          </Suspense>
        </div>
      </AppLayout>
    );
  }
}
const mapStateToProps = ({ menu }) => {
  const { containerClassnames } = menu;
  return { containerClassnames };
};

export default withRouter(
  connect(
    mapStateToProps,
    {}
  )(App)
);
