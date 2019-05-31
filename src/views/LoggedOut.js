import React from "react";
import {connect} from "react-redux";
import {login} from "../actions/SecurityActions";

function LoggedOut({dispatch: dispetch}) {
  const logUserIn = (): void => {
    dispetch(login());
  };
  return (
    <div>
      <h3 style={{
        margin: 0,
        padding: '1.17em',
      }}>Hey it looks like you need to login!</h3>
      <button onClick={() => logUserIn()}>Login</button>
    </div>
  );
}

export default connect()(LoggedOut);
