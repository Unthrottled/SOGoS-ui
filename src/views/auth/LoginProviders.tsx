import CloudOff from '@material-ui/icons/CloudOff';
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Typography} from '@material-ui/core';
import {useHistory} from 'react-router-dom';
import {createRequestLogonEvent} from '../../events/SecurityEvents';
import {GlobalState, selectNetworkState, selectSecurityState,} from '../../reducers';
import Banner from '../components/Banner';
import {AmazonLoginButton, GoogleLoginButton} from "react-social-login-buttons";

const mapStateToProps = (state: GlobalState) => {
  const {isOnline} = selectNetworkState(state);
  const {isLoggedIn} = selectSecurityState(state);
  return {
    isOnline,
    isLoggedIn,
  };
};

const LoginProviders = () => {
  const dispetch = useDispatch();
  const {isOnline, isLoggedIn} = useSelector(mapStateToProps);
  const logUserIn = (identityProvider: string): void => {
    dispetch(createRequestLogonEvent(identityProvider));
  };
  const history = useHistory();

  useEffect(() => {
    if (isLoggedIn) {
      history.push('/');
    }
  }, [history, isLoggedIn]);

  return (
    <Banner hideExcerpt>
      {isOnline ? (
        <div style={{
          margin: '2rem auto 0 auto',
          width: '300px',
          justifyContent: 'center',
        }}>
          <GoogleLoginButton align={"center"} onClick={() => logUserIn("Google")}/>
          <AmazonLoginButton align={"center"} onClick={() => logUserIn("LoginWithAmazon")}/>
        </div>
      ) : (
        <div>
          <hr/>
          <div
            style={{
              color: 'black',
              display: 'flex',
            }}>
            <CloudOff
              style={{
                fontSize: '10rem',
              }}
            />
            <div>
              <Typography variant={'h4'} align="center" paragraph>
                Internet is needed to login!
              </Typography>
              <Typography
                variant="h5"
                align="center"
                color="textSecondary"
                paragraph>
                After that, you are free to use the SOGoS offline
                <span aria-label={'cool emoji'} role={'img'}>
                  &#128526;
                </span>
              </Typography>
            </div>
          </div>
        </div>
      )}
    </Banner>
  );
};
export default LoginProviders;
