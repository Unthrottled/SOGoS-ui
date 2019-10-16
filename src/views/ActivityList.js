// @flow
import * as React from 'react';
import {Component} from 'react';
import List from "@material-ui/core/List";
import {Card, makeStyles} from "@material-ui/core";
import {TacticalActivityIcon} from "./TacticalActivityIcon";
import {selectStrategyState, selectTacticalActivityState} from "../reducers";
import {connect} from "react-redux";
import type {TacticalActivity} from "../types/TacticalModels";
import {objectToArray} from "../miscellanous/Tools";

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
      padding: `${theme.spacing(0.5)}px ${theme.spacing(2)}px`,
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
  activities: any,
  actionComponent?: (TacticalActivity) => Component,
};

const ActivityList = (props: Props) => {
  const allTacticalActivities: TacticalActivity[] = objectToArray(props.activities);
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <List justify={'center'}>
        <div>
          <div
            style={{flexGrow: 1}}

          >
            {
              allTacticalActivities.map(tacticalActivity => (
                <div className={classes.activity}>
                  <Card key={tacticalActivity.id}>
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


const mapStateToProps = state => {
  const {objectives} = selectStrategyState(state);
  const {activities} = selectTacticalActivityState(state);
  return {
    objectives,
    activities
  }
};

export default connect(mapStateToProps)(ActivityList);
