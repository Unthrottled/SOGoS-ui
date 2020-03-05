import React, {FC} from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Container from '@material-ui/core/Container';
import {Typography} from '@material-ui/core';
import {SOGoS} from '../icons/SOGoS';

const useStyles = makeStyles(theme => ({
  headerContent: {
    borderRadius: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6, 0, 6),
    marginBottom: theme.spacing(1),
  },
}));

interface Props {
  hideExcerpt?: boolean
}

const Banner: FC<Props> = ({
                             children,
                             hideExcerpt,
                           }) => {
  const {headerContent} = useStyles();

  return (
    <div style={{height: '100%'}}>
      <div
        style={{
          display: 'table',
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '100%',
        }}>
        <div
          style={{
            display: 'table-cell',
            verticalAlign: 'middle',
          }}>
          <Container maxWidth={'lg'}>
            <div className={headerContent}>
              <Container
                maxWidth={'sm'}
                style={{
                  textAlign: 'center',
                }}>
                <Typography
                  component={'h1'}
                  variant={'h2'}
                  align={'center'}
                  color={'textPrimary'}
                  gutterBottom>
                  SOGoS
                </Typography>
                <Typography
                  color={'textSecondary'}
                  align={'center'}
                  gutterBottom>
                  Strategic Orchestration and Governance System
                </Typography>
                {
                  !hideExcerpt &&
                  <Typography
                    variant="h5"
                    align="center"
                    color="textSecondary"
                    paragraph>
                    Find and reach your maximum potential! Push yourself to the
                    limits of your ability. Knowing that you can rest easy when
                    you really need to.
                  </Typography>
                }
                <SOGoS/>
                {children}
              </Container>
            </div>
          </Container>
        </div>
      </div>
    </div>
  );
};
export default Banner;
