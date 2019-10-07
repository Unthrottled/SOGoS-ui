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
import {TacticalIcon} from "./TacticalIcon";
import HistoryIcon from '@material-ui/icons/History';
import SettingsIcon from '@material-ui/icons/Settings';
import CardContent from "@material-ui/core/CardContent";

const useStyles = makeStyles(theme => ({
  content: {
    flexGrow: 1,
  },
  headerContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6, 0, 6),
    marginBottom: theme.spacing(1),
  },
  placeIcon: {
    padding: theme.spacing(2)
  },
  gridItem: {
    padding: theme.spacing(1),
  }
}));

const placesToGo = [
  {
    name: 'History',
    description: 'Look at all the shit you have done!',
    icon: <HistoryIcon style={{fontSize: '100px'}}/>,
    navigator: (history, guid) => () => history.push(`./${guid}/history/`)
  },
  {
    name: 'Strategy',
    description: 'What shit do I need to get together?',
    icon: <StrategyIcon/>,
    navigator: (history, guid) => () => history.push(`./strategy/`)
  },
  {
    name: 'Tactics',
    description: 'How to do I get my shit together?',
    icon: <TacticalIcon/>,
    navigator: (history, guid) => () => history.push(`./tactical/`)
  },
  {
    name: 'Settings',
    description: 'Get your shit together.',
    icon: <SettingsIcon style={{fontSize: '100px'}}/>,
    navigator: (history, guid) => () => history.push(`./settings/`)
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
            >
              {
                placesToGo.map(placeToGo => (
                  <Grid item
                        className={classes.gridItem}
                        key={placeToGo.name}
                  >
                    <Card>
                      <CardActionArea onClick={placeToGo.navigator(history, guid)}>
                        <div className={classes.placeIcon}>
                          {placeToGo.icon}
                        </div>
                        <CardContent>
                          <Typography gutterBottom variant="h5" component="h2">
                            {placeToGo.name}
                          </Typography>
                          <Typography gutterBottom variant="body2" color="textSecondary" component="p">
                            {placeToGo.description}
                          </Typography>
                        </CardContent>
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
