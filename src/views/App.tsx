import React from 'react';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import './App.css';
import {useSelector} from 'react-redux';
import LoggedOut from './auth/LoggedOut';
import {ThemeProvider} from '@material-ui/styles';
import {createMuiTheme, responsiveFontSizes} from '@material-ui/core/styles';
import {blue} from '@material-ui/core/colors';
import {Route, Switch} from 'react-router-dom';
import PrivateRoute from './auth/PrivateRoute';
import makeStyles from '@material-ui/core/styles/makeStyles';
import ActivityTimer from './time/ActivityTimeBar';
import Dashboard from './Dashboard';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import {GlobalState, selectSecurityState} from '../reducers';
import {SecurityState} from '../reducers/SecurityReducer';
import OutOfSync from './components/OutOfSync';
import Banner from './components/Banner';
import About from "./About";
import Typography from "@material-ui/core/Typography";

export const PRIMARY_THEME_COLOR = '#f9c048';
const theme = responsiveFontSizes(
  createMuiTheme({
    palette: {
      primary: {
        main: PRIMARY_THEME_COLOR,
        //@ts-ignore real
        alertColor: '#f9ff75',
      },
      secondary: blue,
    },
  }),
);

const useStyles = makeStyles(_ => ({
  content: {
    height: '100%',
  },
  '@global': {
    '*::-webkit-scrollbar': {
      width: '0.4em',
    },
    '*::-webkit-scrollbar-track': {
      '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)',
    },
    '*::-webkit-scrollbar-thumb': {
      backgroundColor: PRIMARY_THEME_COLOR,
      outline: '1px solid slategrey',
    },
  },
}));

const mapStateToProps = (globalState: GlobalState) => {
  const {isInitialized, isOutOfSync}: SecurityState = selectSecurityState(
    globalState,
  );
  return {
    isInitialized,
    isOutOfSync,
  };
};

const App = () => {
  const classes = useStyles();
  const {isOutOfSync} = useSelector(mapStateToProps);

  const getComponent = () => {
    if (isOutOfSync) {
      return <OutOfSync/>;
    } else {
      return (
        <div className="App">
          <div className={classes.content}>
            <Switch>
              <Route path={'/login'} component={LoggedOut}/>
              <Route path={'/about'} component={About}/>
              <PrivateRoute path={'/'} exact component={Dashboard}/>
              <Route component={() => (
                <Banner navigateable hideExcerpt>
                  <Typography variant={'h5'} color="textSecondary">
                    The page you are looking for does not exist, sorry!
                  </Typography>
                </Banner>
              )}/>
            </Switch>
            <ActivityTimer/>
          </div>
        </div>
      );
    }
  };

  return <ThemeProvider theme={theme}>{getComponent()}</ThemeProvider>;
};

export default App;
