import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const Loan = React.lazy(() =>
  import(/* webpackChunkName: "second" */ './loan-page')
);
const SecondMenu = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/loan`} />
      <Route
        path={`${match.url}/loan`}
        render={props => <Loan {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default SecondMenu;
