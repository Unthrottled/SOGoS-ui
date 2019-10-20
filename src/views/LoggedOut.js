import CloudOff from '@material-ui/icons/CloudOff';
import React from "react";
import {connect} from "react-redux";
import {login} from "../actions/SecurityActions";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import {Typography} from "@material-ui/core";
import {Reach} from "./Reach";

const useStyles = makeStyles(theme => ({
  headerContent: {
    borderRadius: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6, 0, 6),
    marginBottom: theme.spacing(1),
  },
  root: {
    background: 'linear-gradient(45deg, #e49d2c 30%, #e0be5f 90%)',
    borderRadius: 3,
    border: 0,
    color: '#6e6e6e',
    height: 48,
    padding: '0 30px',
    boxShadow: '0 3px 5px 2px rgba(227, 158, 45, .5)',
  },
  label: {
    textTransform: 'capitalize',
  },
}));

function LoggedOut({dispatch: dispetch, isOnline}) {
  const {root, label, headerContent} = useStyles();
  const logUserIn = (): void => {
    dispetch(login());
  };
  return isOnline ? (
    <div style={{height: '100%'}}>
      <div style={{margin: 'auto'}}>
        <Container maxWidth={'lg'}>
          <div className={headerContent}>
            <Container maxWidth={'sm'}>
              <Typography component={'h1'}
                          variant={'h2'}
                          align={'center'}
                          color={'textPrimary'}
                          gutterBottom>
                SOGoS
              </Typography>
              <Typography variant="h5" align="center" color="textSecondary" paragraph>
                Short and leading about the collection below—its contents, the
                creator, etc.
                Make it short and sweet, but not too short so folks don&apos;t simply skip over it
                entirely.
              </Typography>
              <Reach/>
              <Button
                classes={{
                  root,
                  label
                }}
                onClick={() => logUserIn()}>Take me to Log In!</Button>
            </Container>
          </div>
        </Container>
      </div>
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
