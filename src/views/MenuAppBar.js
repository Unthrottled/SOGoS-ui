import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import {connect} from "react-redux";
import {logout} from "../actions/SecurityActions";
import OfflineMode from "./OfflineMode";
import InstallApplication from "./InstallApplication";
import UpdateApplication from "./UpdateApplication";
import {Link} from "react-router-dom";
import MenuNavigation from "./MenuNavigation";
import ManualSync from "./ManualSync";

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

const MenuAppBar = ({dispatch: dispetch}) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logUserOut = (): void => {
    dispetch(logout());
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <MenuNavigation/>
          <OfflineMode/>
          <ManualSync/>
          <Typography variant="h6" className={classes.title}>
            <Link to={'/'} className={classes.link}>SOGoS</Link>
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
              <SettingsIcon/>
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
