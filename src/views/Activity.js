import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import SpeedDial from "@material-ui/lab/SpeedDial";
import React, {useState} from "react";
import Timer from '@material-ui/icons/AvTimer';
import {makeStyles} from '@material-ui/core/styles';
import uuid from 'uuid/v4';
import {startTimedActivity} from "../actions/ActivityActions";
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
}));

const Activity = ({dispatch: dispetch}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const commenceActivity = () => {
    dispetch(startTimedActivity({
      name: "SOME_ACTIVITY",
      uuid: uuid(),
    }));
  };
  const handleClick = () => {
    setOpen(!open)
  };

  const actions = [
    {icon: <Timer/>, name: 'Start Task', perform: () => commenceActivity()},
  ];

  return (
    <SpeedDial
      ariaLabel="SpeedDial example"
      className={classes.speedDial}
      hidden={false}
      icon={<SpeedDialIcon/>}
      onClick={handleClick}
      open={open}
      direction={"right"}
    >
      {actions.map(action => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          onClick={() => {
            handleClick();
            action.perform();
          }}
          title={""}
          children={<div/>}/>
      ))}
    </SpeedDial>
  );
};

export default connect()(Activity);
