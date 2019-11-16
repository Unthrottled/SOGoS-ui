import * as React from 'react';
import IconButton from "@material-ui/core/IconButton";
import makeStyles from "@material-ui/core/styles/makeStyles";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import CheckIcon from '@material-ui/icons/Check';
import DeleteIcon from '@material-ui/icons/Delete';

type Props = {
  onCancel: Function,
  onSave: Function,
  onComplete?: Function,
  completionIcon?: JSX.Element,
  completionTitle?: string,
  onDelete?: Function,
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
  const CompletionIcon = props.completionIcon || CheckIcon;
  return (
    <div>
      // @ts-ignore
      <IconButton color={'primary'}
                  className={classes.save}
                  onClick={props.onSave}
      >
        <SaveIcon className={classes.icon}/>
      </IconButton>
      {
        props.onComplete &&
        // @ts-ignore
        <IconButton color={'primary'}
                    className={classes.save}
                    onClick={props.onComplete}
                    title={props.completionTitle || 'Complete'}
        >
          // @ts-ignore
          <CompletionIcon className={classes.icon}/>
        </IconButton>
      }
      {
        props.onDelete &&
        // @ts-ignore
        <IconButton color={'primary'}
                    className={classes.save}
                    onClick={props.onDelete}
        >
          <DeleteIcon className={classes.icon}/>
        </IconButton>
      }
      // @ts-ignore
      <IconButton color={'primary'}
                  className={classes.save}
                  onClick={props.onCancel}
                  title={'Discard Changes'}
      >
        <CancelIcon className={classes.icon}/>
      </IconButton>
    </div>
  );
};
