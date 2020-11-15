import React from 'react';
import {Link, Typography} from '@material-ui/core';
import Banner from '../components/Banner';

export const themeStyles = {
  root: {
    background: 'linear-gradient(45deg, #e49d2c 30%, #e0be5f 90%)',
    borderRadius: 3,
    border: 0,
    color: '#585858',
    height: 48,
    padding: '0 30px',
    boxShadow: '0 3px 5px 2px rgba(227, 158, 45, .5)',
  },
  label: {
    textTransform: 'capitalize',
  },
};

const LoggedOut = () => {
  return (
    <Banner>
      <Typography variant={'h5'} color="textSecondary">
        SOGos has fulfilled its purpose and has been sunset.
      </Typography>
      <Typography variant={'h5'} color="textSecondary">
        For more information <Link href={'https://youtu.be/dQw4w9WgXcQ'}>follow this link.</Link>
      </Typography>
    </Banner>
  );
};
export default LoggedOut;
