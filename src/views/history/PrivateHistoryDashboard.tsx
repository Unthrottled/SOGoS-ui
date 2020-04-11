import React, {FC, useEffect, useState} from 'react';
import LoggedInLayout from '../components/LoggedInLayout';
import HistoryDashboardComponents from "./HistoryDashboardComponents";
import {Switch} from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import IconButton from "@material-ui/core/IconButton";
import ShareIcon from "@material-ui/icons/Share";
import ViewIcon from "@material-ui/icons/Visibility";
import SocialShare from "../components/SocialShare";
import {connect, useDispatch} from "react-redux";
import {GlobalState, selectSecurityState} from "../../reducers";
import {createUserUpdatedSharedDashboardEvent} from "../../events/UserEvents";
import {createViewedHistoryEvent} from "../../events/HistoryEvents";
import {SharedStatus} from "../../reducers/SecurityReducer";
import {useHistory} from 'react-router-dom';
import Badge from "@material-ui/core/Badge";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import { Transition } from '../components/PopupModal';

const PrivateHistoryDashboard: FC<Props> = ({
                                              shareCode,
                                              hasShared
                                            }) => {
  const shared = hasShared;
  const dispatch = useDispatch();
  const toggleShare = () => {
    dispatch(createUserUpdatedSharedDashboardEvent(!shared));
  }

  const history = useHistory();
  const navigateToSharedHistory = () => {
    history.push('./shared')
  }

  const [helpOpen, setHelpOpen] = useState(false);
  const closeHelp = () => {
    setHelpOpen(false)
  }

  const openHelp = () => {
    setHelpOpen(true);
  }

  useEffect(() => {
    dispatch(createViewedHistoryEvent());
  }, [dispatch])

  return (
    <LoggedInLayout>
      <div style={{
        display: 'flex',
        marginBottom: '0.5rem',
      }}>
        <div style={{flexGrow: 1}}/>
        <div style={{display: "flex"}}>
          {
            shared &&
            (<div style={{display: 'flex'}}>
                <IconButton title={'View Shared Dashboard'}
                            onClick={navigateToSharedHistory}>
                  <ViewIcon/>
                </IconButton>
                <SocialShare sharingUrl={
                  `https://sogos.unthrottled.io/dashboard/${shareCode}`
                }><IconButton
                  title={'Share your dashboard!'}
                  color={'primary'}
                  aria-label="Menu">
                  <ShareIcon/>
                </IconButton>
                </SocialShare>
              </div>
            )
          }
          <InputLabel style={{margin: 'auto'}}><Switch
            checked={shared}
            onChange={toggleShare}
            color={'primary'}
          />Enable Sharing</InputLabel>
          <Badge badgeContent={'?'}
                 style={{'cursor': 'pointer'}}
                 color={'primary'} onClick={openHelp}>
          </Badge>
        </div>

      </div>
      <HistoryDashboardComponents/>
      <Dialog
        open={helpOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={closeHelp}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description">
        <DialogTitle id="alert-dialog-slide-title">What is the Sharable Dashboard?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            The sharable dashboard is a way to share your activity data with others.
            They will only be able to see your data if you let them.
            When you disable sharing your data is locked away.

            I made a great effort to ensure all our data is safe.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeHelp}>
            Okay!
          </Button>
        </DialogActions>
      </Dialog>
      </LoggedInLayout>
  );
};

interface Props {
  hasShared?: boolean;
  shareCode?: string;
}

const mapStateToProps = (globalState: GlobalState): Props => {
  const {
    hasShared,
    shareCode
  } = selectSecurityState(globalState);
  return {
    hasShared: hasShared === SharedStatus.SHARED,
    shareCode
  }
}

export default connect(mapStateToProps)(PrivateHistoryDashboard);
