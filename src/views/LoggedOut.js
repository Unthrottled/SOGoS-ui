import CloudOff from '@material-ui/icons/CloudOff';
import React from "react";
import {connect} from "react-redux";
import {login} from "../actions/SecurityActions";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({
  root: {
    background: 'linear-gradient(45deg, #C88CFE 30%, #FF80AA 90%)',
    borderRadius: 3,
    border: 0,
    color: 'white',
    height: 48,
    padding: '0 30px',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  },
  label: {
    textTransform: 'capitalize',
  },
}));

function LoggedOut({dispatch: dispetch, isOnline}) {
  const {root, label} = useStyles();
  const logUserIn = (): void => {
    dispetch(login());
  };
  return isOnline ? (
    <div>
      <h3 style={{
        margin: 0,
        padding: '1.17em',
      }}>Hey it looks like you need to login!</h3>
      <Button
        classes={{
          root,
          label
        }}
        onClick={() => logUserIn()}>Take me to Log In!</Button>
    </div>
  ) : (
    <div>
      <CloudOff style={{
        fontSize: '10rem'
      }}/>
      <h3 style={{
        margin: 0,
        padding: '1.17em',
      }}>Hey, You need wifi before you can log in!</h3>
      <div>After that, you are free to use the app offline :)</div>
    </div>
  );
}

const mapStateToProps = state => {
  const {network: {isOnline}} = state;
  return {
    isOnline,
  }
};
export default connect(mapStateToProps)(LoggedOut);
