import {connect} from 'react-redux';
import * as React from 'react';
import {Redirect} from "react-router-dom";

const PrivateRoute = ({isLoggedIn, component: Component, ...rest}) =>
  (
    isLoggedIn ? (
      <Component {...rest} />
    ) : (
      <Redirect
        to={{
          ...rest.location,
          pathname: "/login",
          state: {from: rest.location}
        }}
      />
    )
  );

const mapStateToProps = state => {
  const {security: {isLoggedIn},} = state;
  return {
    isLoggedIn,
  }
};

export default connect(mapStateToProps)(PrivateRoute)
