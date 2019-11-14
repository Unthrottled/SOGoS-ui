import {connect} from "react-redux";
import React from "react";
import Zoom from '@material-ui/core/Zoom';
import Tooltip from '@material-ui/core/Tooltip';
import Sync from '@material-ui/icons/Sync';
import {makeStyles} from "@material-ui/core";
import {selectNetworkState, selectUserState} from "../reducers";
import IconButton from "@material-ui/core/IconButton";
import {requestedManualSync} from "../actions/UserActions";

const useStyles = makeStyles(theme => ({
  offline: {
    color: theme.palette.primary.alertColor
  },
}));

const ManualSync = ({isOnline, hasItemsCached, dispatch}) => {
  const classes = useStyles();
  const shouldDisplay = isOnline && hasItemsCached;
  return shouldDisplay ? (
    <IconButton color={'inherit'} onClick={()=>dispatch(requestedManualSync())}>
      <Tooltip title={"Manually sync your data"}>
        <Zoom in={shouldDisplay}>
          <Sync id={'manual-sync'} className={classes.offline}/>
        </Zoom>
      </Tooltip>
    </IconButton>
  ) : null;
};
const mapStateToProps = state => {
  const {isOnline} = selectNetworkState(state);
  const {miscellaneous: {hasItemsCached}} = selectUserState(state);
  return {
    isOnline,
    hasItemsCached,
  }
};
export default connect(mapStateToProps)(ManualSync);
