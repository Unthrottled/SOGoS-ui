import {connect, DispatchProp} from "react-redux";
import React, {FC} from "react";
import Zoom from '@material-ui/core/Zoom';
import Tooltip from '@material-ui/core/Tooltip';
import Sync from '@material-ui/icons/Sync';
import {makeStyles} from "@material-ui/core";
import {GlobalState, selectNetworkState, selectUserState} from "../../reducers";
import IconButton from "@material-ui/core/IconButton";
import {createRequestedSyncEvent} from "../../events/UserEvents";

const useStyles = makeStyles(theme => ({
  offline: {
    // @ts-ignore real
    color: theme.palette.primary.alertColor
  },
}));

type Props = DispatchProp & {
  isOnline: boolean,
  hasItemsCached: boolean,
};

const ManualSync: FC<Props> = ({
                                 isOnline,
                                 hasItemsCached,
                                 dispatch: dispetch
                               }) => {
  const classes = useStyles();
  const shouldDisplay = isOnline && hasItemsCached;
  return shouldDisplay ? (
    <IconButton color={'inherit'} onClick={() => dispetch(createRequestedSyncEvent())}>
      <Tooltip title={"Manually sync your data"}>
        <Zoom in={shouldDisplay}>
          <Sync id={'manual-sync'} className={classes.offline}/>
        </Zoom>
      </Tooltip>
    </IconButton>
  ) : null;
};
const mapStateToProps = (state: GlobalState) => {
  const {isOnline} = selectNetworkState(state);
  const {miscellaneous: {hasItemsCached}} = selectUserState(state);
  return {
    isOnline,
    hasItemsCached,
  }
};
export default connect(mapStateToProps)(ManualSync);
