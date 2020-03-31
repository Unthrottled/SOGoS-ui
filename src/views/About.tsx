import React, {FC} from 'react';
import {connect} from "react-redux";
import {GlobalState} from "../reducers";
import {Typography} from "@material-ui/core";
import Container from "@material-ui/core/Container";
import makeStyles from "@material-ui/core/styles/makeStyles";

interface Props {

}

const useStyles = makeStyles(theme => ({
  headerContent: {
    borderRadius: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6, 0, 6),
    marginBottom: theme.spacing(1),
  },
}));


const About: FC<Props> = () => {
  const {headerContent} = useStyles();

  return (
    <div style={{height: '100%',}}>
      <div
        style={{
          display: 'block',
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '100%',
        }}>
        <div
          style={{
            verticalAlign: 'middle',
          }}>
          <Container maxWidth={'lg'}>
            <div className={headerContent}>
              <Container
                maxWidth={'sm'}
                style={{}}>
                <Typography
                  component={'h1'}
                  variant={'h4'}
                  align={'center'}
                  color={'textPrimary'}
                  gutterBottom>
                  Why SOGoS?
                </Typography>
                <Typography
                  component={'h1'}
                  variant={'h2'}
                  align={'center'}
                  color={'textPrimary'}
                  gutterBottom>
                  Recovery
                </Typography>
                <Typography
                  variant="h5"
                  align="left"
                  color="textSecondary"
                  paragraph>
                  Some Text
                </Typography>
                <Typography
                  component={'h1'}
                  variant={'h3'}
                  align={'center'}
                  color={'textPrimary'}
                  gutterBottom>
                  Strategy
                </Typography>
              </Container>
            </div>
          </Container>
        </div>
      </div>
    </div>
  );
};

export const mapStateToProps = (globalState: GlobalState): Props => {
  return {}
}

export default connect(mapStateToProps)(About);
