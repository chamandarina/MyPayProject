import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const LoansPage = React.lazy(() =>
  import(/* webpackChunkName: "second" */ './loans-page')
);
const Loans = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/loans-page`} />
      <Route
        path={`${match.url}/loans-page`}
        render={props => <LoansPage {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default Loans;
