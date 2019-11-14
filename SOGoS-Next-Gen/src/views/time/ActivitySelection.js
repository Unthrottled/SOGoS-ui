// @flow
import * as React from 'react';
import {Component} from 'react';
import IconButton from "@material-ui/core/IconButton";
import {Cancel, KeyboardArrowDown} from "@material-ui/icons";
import {objectToArray} from "../../miscellanous/Tools";
import type {TacticalActivity} from "../types/TacticalModels";
import {TacticalActivityIcon} from "../icons/TacticalActivityIcon";
import {Grow, makeStyles} from "@material-ui/core";
import {selectTacticalActivityState} from "../../reducers";
import {connect} from "react-redux";

const useStyles = makeStyles(theme => ({
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  speedDial: {
    position: 'relative',
    top: theme.spacing(1),
    left: theme.spacing(1),
    margin: theme.spacing(1),
  },
  hubRoot: {
    position: 'absolute',
    top: theme.spacing(7),
  },
  container: {
    background: 'rgba(0,0,0,0.90)',
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    zIndex: '1051',
    overflow: 'auto',
  },
  toolTip: {
    zIndex: '9200',
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  toolTipInner: {
    display: 'inline-block',
    fontSize: '1.5em',
  },
  contents: {
    top: '5%',
    height: '100%',
    position: 'relative',
  },
  icon: {
    fontSize: '4em',
  },
  cancel: {
    marginTop: theme.spacing(5),
  },
  cancelIcon: {
    fontSize: '2.5em',
    color: 'red',
    background: 'rgba(240, 0,0,0.25)',
    borderRadius: '50%',
  },
  bigIcon: {
    fontSize: "175px",
    padding: "25px",
    background: theme.palette.primary.main,
    borderRadius: '50%',
  },
  bigIconTomato: {
    padding: "30px",
    background: theme.palette.primary.main,
    borderRadius: '50%',
  },
  activityIcon: {},
  activityContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
}));

type Props = {
  open: boolean,
  activities?: TacticalActivity[],
  onClose: Function,
  onActivitySelection: Function,
  onGenericActivitySelection: Function,
  genericIcon: Component,
};

const ActivitySelection = (props: Props) => {
  const classes = useStyles();

  return (
    <Grow in={props.open}>
      <div className={classes.container}>
        <div className={classes.contents}>
          <IconButton
            className={classes.cancel}
            onClick={props.onClose}
            color={'inherit'}>
            <Cancel className={classes.cancelIcon}/>
          </IconButton>
          <br/>
          <div className={classes.activityContainer}>
            {
              objectToArray(props.activities).map((activity: TacticalActivity) => (
                <div key={`tip_${activity.id}`}>
                  <div className={classes.toolTip}>
                    <span className={classes.toolTipInner}>{activity.name}</span>
                    <KeyboardArrowDown style={{fontSize: '2em'}}/>
                  </div>
                  <IconButton color={'inherit'}
                              className={classes.activityIcon}
                              onClick={() => props.onActivitySelection(activity)}>
                    <TacticalActivityIcon tacticalActivity={activity} size={{
                      height: '150px',
                      width: '150px',
                    }}/>
                  </IconButton>
                </div>
              ))
            }
          </div>
          <div className={classes.toolTip}>
            <span className={classes.toolTipInner}>Generic</span>
            <KeyboardArrowDown style={{fontSize: '2em'}}/>
          </div>
          <IconButton
            onClick={props.onGenericActivitySelection}
            color={'inherit'}>
            {props.genericIcon}
          </IconButton>
        </div>
      </div>
    </Grow>
  );
};

const mapStateToProps = (state : GlobalState) => {
  const {activities} = selectTacticalActivityState(state);
  return {
    activities
  }
};

const connected: ActivitySelection = connect(mapStateToProps)(ActivitySelection);

export default connected;
