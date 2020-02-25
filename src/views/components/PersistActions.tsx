import * as React from 'react';
import IconButton from '@material-ui/core/IconButton';
import makeStyles from '@material-ui/core/styles/makeStyles';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckIcon from '@material-ui/icons/Check';
import DeleteIcon from '@material-ui/icons/Delete';
import {SvgIconProps} from '@material-ui/core/SvgIcon';

type Props = {
  onCancel: () => void;
  onSave: () => void;
  onComplete?: () => void;
  completionIcon?: (props: SvgIconProps) => JSX.Element;
  completionTitle?: string;
  onDelete?: () => void;
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
  // @ts-ignore real
  const CompletionIcon: (props: SvgIconProps) => JSX.Element =
    props.completionIcon || CheckIcon;
  return (
    <div>
      <IconButton
        color={'primary'}
        className={classes.save}
        onClick={props.onSave}>
        <SaveIcon className={classes.icon} />
      </IconButton>
      {props.onComplete && (
        <IconButton
          color={'primary'}
          className={classes.save}
          onClick={props.onComplete}
          title={props.completionTitle || 'Complete'}>
          <CompletionIcon className={classes.icon} />
        </IconButton>
      )}
      {props.onDelete && (
        <IconButton
          color={'primary'}
          className={classes.save}
          onClick={props.onDelete}>
          <DeleteIcon className={classes.icon} />
        </IconButton>
      )}
      <IconButton
        color={'primary'}
        className={classes.save}
        onClick={props.onCancel}
        title={'Discard Changes'}>
        <CancelIcon className={classes.icon} />
      </IconButton>
    </div>
  );
};
