import {Typography} from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/ErrorOutline';
import Banner from './Banner';
import React from 'react';

const OutOfSync = () => (
  <Banner hideExcerpt>
    <Typography color={'textSecondary'}>
      <ErrorIcon style={{fontSize: '3em', marginTop: '1em'}} />
    </Typography>
    <Typography color="textSecondary">
      Your datetime settings appear to be off. In order to use SOGoS, please
      correct the issue and refresh the browser.
    </Typography>
  </Banner>
);

export default OutOfSync;
