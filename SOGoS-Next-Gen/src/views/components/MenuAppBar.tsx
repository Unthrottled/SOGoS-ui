import React, {FC, MouseEventHandler} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import {connect, DispatchProp} from "react-redux";
import OfflineMode from "./OfflineMode";
import InstallApplication from "./InstallApplication";
import UpdateApplication from "./UpdateApplication";
import {Link} from "react-router-dom";
import MenuNavigation from "./MenuNavigation";
import ManualSync from "./ManualSync";
import {requestLogoff} from "../../events/SecurityEvents";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  link: {
    textDecoration: 'none',
    color: 'inherit',
  }
}));

type Props = DispatchProp & {

};

const MenuAppBar: FC<Props> = ({dispatch: dispetch}) => {
  const classes = useStyles();
  // @ts-ignore
  const [anchorEl, setAnchorEl] = React.useState<EventTarget>(null);
  const open = Boolean(anchorEl);

  const handleMenu: MouseEventHandler = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logUserOut = (): void => {
    dispetch(requestLogoff());
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <MenuNavigation/>
          <OfflineMode/>
          <ManualSync/>
          <Typography variant="h6" className={classes.title}>
          </Typography>
          <UpdateApplication/>
          <InstallApplication/>
          <div>
            <IconButton
              aria-owns={open ? 'menu-appbar' : undefined}
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <MoreVertIcon/>
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={() => {
                handleClose();
              }}><Link to={'/settings'} className={classes.link}>Settings</Link></MenuItem>
              <MenuItem onClick={() => {
                handleClose();
                logUserOut();
              }}>Logout</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default connect()(MenuAppBar);
