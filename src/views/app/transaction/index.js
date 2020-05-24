import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const Transaction = React.lazy(() =>
  import(/* webpackChunkName: "second" */ './transaction-page')
);
const SecondMenu = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/transaction`} />
      <Route
        path={`${match.url}/transaction`}
        render={props => <Transaction {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default SecondMenu;
