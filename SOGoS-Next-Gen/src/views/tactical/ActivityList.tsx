import * as React from 'react';
import List from "@material-ui/core/List";
import {Card, makeStyles} from "@material-ui/core";
import {TacticalActivityIcon} from "../icons/TacticalActivityIcon";
import {GlobalState, selectStrategyState, selectTacticalActivityState} from "../../reducers";
import {connect, useSelector} from "react-redux";
import {numberObjectToArray} from "../../miscellanous/Tools";
import {TacticalActivity} from "../../types/TacticalTypes";
import {NumberDictionary} from "../../types/BaseTypes";

const useStyles = makeStyles(theme => (
  {
    root: {
      width: '100%',
      textAlign: 'left',
    },
    button: {
      margin: theme.spacing(1)
    },
    headerContent: {
      borderRadius: theme.spacing(1),
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
      flexGrow: 1,
    },
    activityAvatar: {
      padding: theme.spacing(1),
      textAlign: 'center',
    },
    objectiveSummary: {},
    content: {
      padding: theme.spacing(2),
      alignItems: 'center',
      textAlign: 'center',
      display: 'flex',
    },
    activity: {
      padding: `${theme.spacing(0.5)}px 0px`,
      textAlign: 'center'
    },
    inputContainer: {
      textAlign: 'center',
    },
    save: {
      margin: theme.spacing(2),
    },
    activityCard: {
      maxWidth: 250,
    },
  }
));

type Props = {
  actionComponent?: (arg1: TacticalActivity) => JSX.Element,
  hidden?: boolean,
};

const mapStateToProps = (state: GlobalState) => {
  const {objectives} = selectStrategyState(state);
  const {activities, archivedActivities} = selectTacticalActivityState(state);
  return {
    objectives,
    activities,
    archivedActivities,
  }
};

const ActivityList = (props: Props) => {
  const selectedState = useSelector(mapStateToProps);
  const allTacticalActivities: TacticalActivity[] = numberObjectToArray(
    props.hidden ? selectedState.archivedActivities :
      selectedState.activities
  );
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <List>
        <div>
          <div
            style={{flexGrow: 1}}
          >
            {
              allTacticalActivities.map(tacticalActivity => (
                <div key={tacticalActivity.id}
                     className={classes.activity}>
                  <Card>
                    <div className={classes.content}>
                      <div className={classes.activityAvatar}>
                        <TacticalActivityIcon tacticalActivity={tacticalActivity}
                                              size={{
                                                width: '45px',
                                                height: '45px',
                                              }}/>
                      </div>
                      <div className={classes.activityName}>{tacticalActivity.name}</div>
                      <div>
                        {
                          !!props.actionComponent && props.actionComponent(tacticalActivity)
                        }
                      </div>
                    </div>
                  </Card>
                </div>
              ))
            }
          </div>
        </div>
      </List>
    </div>

  );
};



export default ActivityList;
