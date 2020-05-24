import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const AccountPage = React.lazy(() =>
  import(/* webpackChunkName: "start" */ './account')
);
const Account = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/account`} />
      <Route
        path={`${match.url}/account`}
        render={props => <AccountPage {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default Account;
