import React, {useEffect, useState} from 'react';
import GetApp from '@material-ui/icons/GetApp';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import {makeStyles} from '@material-ui/core';
import Zoom from '@material-ui/core/Zoom';

const useStyles = makeStyles(theme => ({
  download: {
    // @ts-ignore real
    color: theme.palette.primary.alertColor,
    opacity: 0.95,
  },
}));

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches;

const InstallApplication = () => {
  const classes = useStyles();
  const [componentDidMount] = useState('didMount');
  const [installPrompt, setInstallPromptState] = useState(
    // @ts-ignore real
    window.sogosInstallPrompt,
  );
  const [askedToInstall, setAskedToInstall] = useState(false);
  useEffect(() => {
    window.addEventListener('beforeinstallprompt', event =>
      setInstallPromptState(event),
    );
  }, [componentDidMount]);

  const installApplication = () => {
    installPrompt.prompt();
    installPrompt.userChoice.then((choice: any) => {
      if (choice.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt', choice);
      } else {
        console.log('User dismissed the A2HS prompt', choice);
      }
      setAskedToInstall(true);
    });
  };

  const hasInstallPrompt = !!installPrompt;
  const firstTimeAsking = !askedToInstall;
  const notInstalledAlready = !isStandalone();
  return (
    <Zoom in={hasInstallPrompt && firstTimeAsking && notInstalledAlready}>
      <Tooltip title={'Install SOGoS!'} onClick={installApplication}>
        <IconButton
          aria-label={'ayy lemon'}
          id={'download-button'}
          className={classes.download}>
          <GetApp />
        </IconButton>
      </Tooltip>
    </Zoom>
  );
};

export default InstallApplication;
