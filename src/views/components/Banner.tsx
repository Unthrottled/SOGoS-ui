import React, {FC} from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Container from '@material-ui/core/Container';
import {Typography, Link} from '@material-ui/core';
import {SOGoS} from '../icons/SOGoS';
import {useDispatch} from "react-redux";
import {push} from "connected-react-router";

const useStyles = makeStyles(theme => ({
  headerContent: {
    borderRadius: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6, 0, 6),
    marginBottom: theme.spacing(1),
  },
  headerContentWithHover: {
    borderRadius: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6, 0, 6),
    marginBottom: theme.spacing(1),
    '&:hover': {
      boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
      backgroundColor: '#fafafa'
    },
  },
}));

interface Props {
  hideExcerpt?: boolean;
  navigateable?: boolean;
}

const Banner: FC<Props> = ({
                             children,
                             hideExcerpt,
                             navigateable
                           }) => {
  const {headerContent, headerContentWithHover} = useStyles();

  const containerProps = navigateable ? {
    cursor: 'pointer',
  } : {};

  const dispetch = useDispatch();
  const navigateMaybe = () => {
    if (navigateable) {
      dispetch(push("/login"));
    }
  }

  const navigateToAbout = () => {
    dispetch(push(('/about')));
  }
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
            <div className={navigateable ? headerContentWithHover: headerContent}
                 style={containerProps}
                 onClick={navigateMaybe}
            >
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
                  <>
                    <Typography
                      variant="h5"
                      align="center"
                      color="textSecondary"
                      paragraph>
                      Find out where your maximum potential lies. Then push yourself to the
                      limits of your ability. Knowing that you can rest easy when
                      you really need to.
                    </Typography>
                    <Typography
                      variant="h5"
                      align="center"
                      color="textSecondary"
                      paragraph>
                      Read more about <Link onClick={navigateToAbout}>what SOGoS can do for you!</Link>
                    </Typography>
                  </>
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
