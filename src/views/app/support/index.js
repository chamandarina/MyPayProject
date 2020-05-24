import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const SupportPage = React.lazy(() =>
  import(/* webpackChunkName: "start" */ './support')
);
const Support = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/support`} />
      <Route
        path={`${match.url}/support`}
        render={props => <SupportPage {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default Support;
