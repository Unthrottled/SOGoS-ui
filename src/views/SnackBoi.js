// @flow
import * as React from 'react';
import {connect} from "react-redux";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {SnackbarContent} from "@material-ui/core";
import WarningIcon from '@material-ui/icons/Warning';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from "@material-ui/core/IconButton";
import {amber} from "@material-ui/core/colors";

const useStyles = makeStyles(theme => ({
  container: {
    zIndex: 90000,
    position: 'absolute',
    left: theme.spacing(5),
    bottom: theme.spacing(5),
  },
  snackBar: {
    backgroundColor: amber[700],
  },
  icon: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  }
}));

type Props = {

};
const SnackBoi = (props: Props) => {
  const classes = useStyles();
  const onClose = ()=>{

  };


  return (
    <div className={classes.container}>
      <SnackbarContent
        className={classes.snackBar}
        message={
          <span className={classes.message}>
            <WarningIcon className={classes.icon}/>
            Finna bust a nut
          </span>
        }
        action={
          [<IconButton key="close" aria-label="close" color="inherit" onClick={onClose}>
          <CloseIcon className={classes.icon} />
        </IconButton>,]}
      />
    </div>
  );
};


const mapStateToProps = state => {
  const {security: {isExpired}} = state;
  return {
    isExpired
  };
};

export default connect(mapStateToProps)(SnackBoi);