import {connect} from "react-redux";
import React, {FC} from "react";
import Zoom from '@material-ui/core/Zoom';
import Tooltip from '@material-ui/core/Tooltip';
import CloudOff from '@material-ui/icons/CloudOff';
import {makeStyles} from "@material-ui/core";
import {GlobalState, selectNetworkState} from "../../reducers";

const useStyles = makeStyles(theme => ({
  offline: {
    // @ts-ignore
    color: theme.palette.primary.alertColor
  },
}));

type Props = {
  isOnline: boolean,
  hasInternet: boolean,
};

const OfflineMode: FC<Props> = ({isOnline, hasInternet}) => {
  const classes = useStyles();
  return (
    <Tooltip title={"Syncing will resume when back online."}>
      <Zoom in={!(isOnline && hasInternet)}>
        <CloudOff id={'offlineIcon'} className={classes.offline}/>
      </Zoom>
    </Tooltip>
  );
};
const mapStateToProps = (state: GlobalState) => {
  const {isOnline, hasInternet} = selectNetworkState(state);
  return {
    isOnline,
    hasInternet
  }
};
export default connect(mapStateToProps)(OfflineMode);
