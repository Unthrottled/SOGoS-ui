import React, {useEffect, useState} from "react";
import SystemUpdate from '@material-ui/icons/SystemUpdate';
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import {makeStyles} from "@material-ui/core";
import Zoom from "@material-ui/core/Zoom";

const useStyles = makeStyles(theme => ({
  download: {
    // @ts-ignore
    color: theme.palette.primary.alertColor,
    opacity: 0.95
  },
}));


const UpdateApplication = () => {
  const classes = useStyles();
  const [componentDidMount] = useState('didMount');
  const [registration, setRegistrationState] = useState<any>(null);
  const [didUpdate, setDidUpdate] = useState(false);
  useEffect(() => {
    // @ts-ignore
    window.addEventListener('sogosUpdateAvailable', (event) => setRegistrationState(event.detail));
  }, [componentDidMount]);

  const installApplication = () => {
    registration && registration.waiting.postMessage('skipWaiting');
    setDidUpdate(true);
  };

  const hasRegistration = !!registration;
  const hasUpdated = !didUpdate;
  return (
    <Zoom in={hasRegistration && hasUpdated}>
      <Tooltip title={'Update SOGoS!'} onClick={installApplication}>
        <IconButton id={'update-button'} className={classes.download}>
          <SystemUpdate/>
        </IconButton>
      </Tooltip>
    </Zoom>
  );
};


export default UpdateApplication;
