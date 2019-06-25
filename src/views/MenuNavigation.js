import React, {useState} from 'react';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from "@material-ui/core/IconButton";
import {Link} from "react-router-dom";
import {makeStyles} from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles(theme => ({
  list: {
    width: 250,
  },
  drawer: {
    backgroundColor: theme.palette.secondary.main,
    position: 'fixed',
    height: '100%',
  },
  fullList: {
    width: 'auto',
  },
  menuButton: {
  },
  grow: {
    flexGrow: 1,
  },
}));


const MenuNavigation = () => {
  const topics = [
    {
      title: 'Strategy',
      path: '/strategy/',
    },
    {
      title: 'Objectives',
      path: '/strategy/objectives/',
    },
    {
      title: 'Tits',
      path: '/tits',

    },
  ];
  const classes = useStyles();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = (open)=>()=> {
    setDrawerOpen(open);
  };

  const getListItem = (index, topic) => {
    return <ListItem button style={{backgroundColor: index % 2 === 0 ? 'rgba(10,10,10, .05)' : 'rgba(0,0,0,0)'}}>
      <ListItemText primary={topic.title}/>
    </ListItem>;
  };

  const menuTopics = [{
    title: 'Home',
    path: '/',
  }, ...topics];
  const fullList = (
    <div className={classes.fullList}>
      <List>
        {menuTopics.map((topic, index) => (
          topic.path ?
            (<Link key={topic.title} to={topic.path} style={{textDecoration: 'none'}}>
              {getListItem(index, topic)}
            </Link>) :
            (<a key={topic.title} href={topic.href} target={'_blank'} style={{textDecoration: 'none'}}>
              {getListItem(index, topic)}
            </a>)
        ))}
      </List>
      <Divider/>
    </div>
  );
  return (
    <div>
      <IconButton edge="start"
                  className={classes.menuButton}
                  color="inherit"
                  onClick={toggleDrawer(true)}
                  aria-label="Menu">
        <MenuIcon/>
      </IconButton>
      <Drawer anchor="left" open={drawerOpen}
              SlideProps={{
                className: classes.drawer,
              }}
              onClose={toggleDrawer(false)}>
        <div
          tabIndex={0}
          role="button"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          {fullList}
        </div>
      </Drawer>
    </div>
  );
};

export default MenuNavigation;
