import {connect} from 'react-redux';
import * as React from 'react';
import {Redirect, Route} from "react-router-dom";
import {GlobalState} from "../../reducers";

const PrivateRoute = (
  {
    isLoggedIn, component:
    Component, ...rest
  }: { isLoggedIn: boolean, component: any }) =>
  (
    <Route
      {...rest}
      render={props =>
        isLoggedIn ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              ...props.location,
              pathname: "/login",
              state: {from: props.location}
            }}
          />
        )
      }
    />
  );

const mapStateToProps = (state: GlobalState) => {
  const {security: {isLoggedIn},} = state;
  return {
    isLoggedIn,
  }
};

export default connect(mapStateToProps)(PrivateRoute)
