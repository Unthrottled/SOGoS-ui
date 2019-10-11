import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import LoggedInLayout from "./LoggedInLayout";
import {makeStyles} from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import AddIcon from '@material-ui/icons/Add'
import uuid from 'uuid/v4';
import {Link, withRouter} from "react-router-dom";
import {objectToArray, objectToKeyValueArray} from "../miscellanous/Tools";
import {createViewedTacticalActivitesEvent} from "../events/TacticalEvents";
import {selectTacticalActivityState, selectUserState} from "../reducers";
import type {TacticalActivity} from "../types/TacticalModels";
import {TacticalActivityIcon} from "./TacticalActivityIcon";
import {Card} from "@material-ui/core";
import CardActionArea from "@material-ui/core/CardActionArea";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import {Responsive, WidthProvider} from "react-grid-layout";
const ResponsiveGridLayout = WidthProvider(Responsive);
// import {SizeMe} from "react-sizeme";


const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    textAlign: 'left',
  },
  button: {
    margin: theme.spacing(1)
  },
  headerContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6, 0, 6),
    marginBottom: theme.spacing(1),
  },
  heading: {
    fontSize: theme.typography.pxToRem(20),
    margin: 'auto 0',
    paddingLeft: '1rem',
    fontWeight: theme.typography.fontWeightRegular,
  },
  objective: {
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  activityName: {
    padding: theme.spacing(1),
    fontSize: '1.25em',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  activityAvatar: {
    padding: theme.spacing(1),
    textAlign: 'center',
  },
  objectiveSummary: {},
  content: {
    paddingBottom: theme.spacing(2),
    alignItems: 'center',
    textAlign: 'center',
  },
  activity: {
    padding: theme.spacing(2),
  },
}));

const ActivitiesDashboard = ({activities, fullName, dispatch, history}) => {
  const classes = useStyles();
  const [didMountState] = useState('');
  useEffect(() => {
    dispatch(createViewedTacticalActivitesEvent());
  }, [didMountState]);

  const allTacticalActivites: TacticalActivity[] = objectToArray(activities);
  const [layouts, setLayouts] = useState({});
  const modifyLayouts = layouts => {
    console.log(layouts);
    const {changed, newLayouts} = objectToKeyValueArray(layouts)
      .reduce((accum, {key, value}) => {

        if(value.length) {
          const byRow = value.reduce((accume, a) => {
            if(!accume[a.y]) accume[a.y] = [];
            accume[a.y].push(a);
            return accume;
          }, {});

          const firstRow = byRow[0];


          console.log(byRow, firstRow);

        } else {
          accum[key] = value
        }

        return accum;
      }, {changed: false, newLayouts: {}});
    if(changed) {
      console.log("finna bust a nut", newLayouts);
    }
  };

  return (
    <LoggedInLayout>
      <div className={classes.headerContent}>
        <Container maxWidth={'sm'}>
          <Typography component={'h1'}
                      variant={'h2'}
                      align={'center'}
                      color={'textPrimary'}
                      gutterBottom>
            Activity Hub
          </Typography>
          <Typography variant="h5" align="center" color="textSecondary" paragraph>
            Something short and leading about the collection below—its contents, the creator, etc.
            Make it short and sweet, but not too short so folks don&apos;t simply skip over it
            entirely.
          </Typography>
          <TacticalActivityIcon/>
        </Container>
      </div>
      <Link to={`./${uuid()}`} style={{textDecoration: 'none'}}>
        <Button variant={'contained'}
                color={'primary'}
                className={classes.button}>
          <AddIcon/> Create Activity
        </Button>
      </Link>
      <ResponsiveGridLayout className="layout"
                            layouts={layouts}
                            breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
                            cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}}
                            margin={[10, 10]}
                            onLayoutChange={(_, layouts) => {
                              modifyLayouts(layouts);
                            }}
      >

        {
          allTacticalActivites.map((tacticalActivity, index) => (
            <div
              key={tacticalActivity.id}
              data-grid={{w: 1, h: 1, x: index, y: 0}}
            >
              <Card>
                <CardActionArea
                  // onClick={() => history.push(`./${tacticalActivity.id}`)}
                >
                  <div className={classes.content}>
                    <div
                      className={classes.activityName}
                      title={tacticalActivity.name}
                    >{tacticalActivity.name}</div>
                    <div className={classes.activityAvatar}>
                      <TacticalActivityIcon tacticalActivity={tacticalActivity}
                                            size={{
                                              width: '75px',
                                              height: '75px',
                                            }}/>
                    </div>
                  </div>
                </CardActionArea>
              </Card>
            </div>
          ))
        }

      </ResponsiveGridLayout>
      <div className={classes.root}>

      </div>
    </LoggedInLayout>
  );
};

const mapStateToProps = state => {
  const {information: {fullName}} = selectUserState(state);
  const {activities} = selectTacticalActivityState(state);
  return {
    fullName,
    activities,
  }
};

export default connect(mapStateToProps)(withRouter(ActivitiesDashboard));
