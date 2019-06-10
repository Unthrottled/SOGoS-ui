import React, {useEffect, useState} from "react";
import GetApp from '@material-ui/icons/GetApp';
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  download: {
    color: theme.palette.primary.alertColor,
    opacity: 0.95
  },
}));

const InstallApplication = () => {
  const classes = useStyles();
  const [componentDidMount] = useState('didMount');
  const [installPrompt, setInstallPromptState] = useState(null);
  useEffect(()=>{
    window.addEventListener('beforeinstallprompt', (event) => setInstallPromptState(event));
  }, [componentDidMount]);

  const installApplication = () => {
    installPrompt.prompt();
    installPrompt.userChoice
      .then(choice => {
        console.log(choice);
        if (choice.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt', choice);
        } else {
          console.log('User dismissed the A2HS prompt', choice);
        }
      });
  };

  return installPrompt ? (
    <Tooltip title={'Install SOGoS!'} onClick={installApplication}>
      <IconButton aria-label={'ayy lemon'} id={'download-button'} className={classes.download}>
        <GetApp/>
      </IconButton>
    </Tooltip>
  ) : null;
};


export default InstallApplication;
