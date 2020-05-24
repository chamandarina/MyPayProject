import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const TransactionsPage = React.lazy(() =>
  import(/* webpackChunkName: "second" */ './transactions-page')
);
const Transactions = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/transactions-page`} />
      <Route
        path={`${match.url}/transactions-page`}
        render={props => <TransactionsPage {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default Transactions;
