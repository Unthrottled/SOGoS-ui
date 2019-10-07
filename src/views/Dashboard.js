import React from "react";
import {connect} from "react-redux";
import LoggedInLayout from "./LoggedInLayout";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Container from "@material-ui/core/Container";
import {selectUserState} from "../reducers";
import {Card, Typography} from "@material-ui/core";
import {Reach} from "./Reach";
import Grid from "@material-ui/core/Grid";
import CardActionArea from "@material-ui/core/CardActionArea";
import {withRouter} from "react-router-dom";
import {StrategyIcon} from "./StrategyIcon";

const useStyles = makeStyles(theme => ({
  content: {
    flexGrow: 1,
    overflow: 'auto',
  },
  headerContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6, 0, 6),
    marginBottom: theme.spacing(1),
  },
}));

const placesToGo = [
  {
    name: 'Yeet',
    description: 'fam ravioli',
    icon: <StrategyIcon/>,
    navigator: (history, guid) => () => history.push(`./${guid}/history`)
  }
];

const Dashboard = ({
                     fullName,
                     guid,
                     history
                   }) => {
  const classes = useStyles();

  return (
    <LoggedInLayout>
      <div className={classes.headerContent}>
        <Container maxWidth={'sm'}>
          <Typography component={'h1'}
                      variant={'h2'}
                      align={'center'}
                      color={'textPrimary'}
                      gutterBottom>
            SOGoS
          </Typography>
          <Typography variant="h5" align="center" color="textSecondary" paragraph>
            Welcome{fullName ? ` ${fullName}` : ''}! short and leading about the collection below—its contents, the
            creator, etc.
            Make it short and sweet, but not too short so folks don&apos;t simply skip over it
            entirely.
          </Typography>
          <Reach/>
        </Container>
      </div>
      <main className={classes.content}>
        <Grid container justify={'center'}>
          <Grid item>
            <Grid container
                  style={{flexGrow: 1}}
                  justify={'center'}
                  spacing={4}
            >
              {
                placesToGo.map(placeToGo => (
                  <Grid item
                        key={placeToGo.name}
                  >
                    <Card>
                      <CardActionArea onClick={placeToGo.navigator(history, guid)}>
                        <div className={classes.content}>
                          <div className={classes.activityName}>{placeToGo.name}</div>
                          <div className={classes.description}>{placeToGo.description}</div>
                          <div className={classes.activityAvatar}>
                            {placeToGo.icon}
                          </div>
                        </div>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))
              }
            </Grid>
          </Grid>
        </Grid>
      </main>
    </LoggedInLayout>
  );
};

const mapStateToProps = state => {
  const {information: {fullName, guid}} = selectUserState(state);
  return {
    fullName,
    guid
  }
};

export default connect(mapStateToProps)(withRouter(Dashboard));
