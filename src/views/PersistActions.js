// @flow
import * as React from 'react';
import IconButton from "@material-ui/core/IconButton";
import makeStyles from "@material-ui/core/styles/makeStyles";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";

type Props = {
  onCancel: Function,
  onSave: Function,
};

const useStyles = makeStyles(theme => ({
  save: {
    width: theme.spacing(10),
    height: theme.spacing(10),
    padding: theme.spacing(2),
  },
  icon: {
    fontSize: '1.5em',
  },
}));

export const PersistActions = (props: Props) => {
  const classes = useStyles();
  return (
    <div>
      <IconButton color={'primary'}
                  className={classes.save}
                  onClick={props.onSave}
      >
        <SaveIcon className={classes.icon}/>
      </IconButton>
      <IconButton color={'primary'}
                  className={classes.save}
                  onClick={props.onCancel}
      >
        <CancelIcon className={classes.icon}/>
      </IconButton>
    </div>
  );
};
