import React, {FC, useState} from 'react';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import {Link} from 'react-router-dom';
import {makeStyles} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import MailIcon from '@material-ui/icons/Mail';
import SettingsIcon from '@material-ui/icons/Settings';
import HomeIcon from '@material-ui/icons/Home';
import {StrategyIcon} from '../icons/StrategyIcon';
import {TacticalIcon} from '../icons/TacticalIcon';
import {GlobalState, selectUserState} from '../../reducers';
import {useSelector} from 'react-redux';
import HistoryIcon from '@material-ui/icons/History';
import {SlideProps} from '@material-ui/core/Slide';
import {ActivityIcon} from "../icons/ActivityIcon";
import {GoalIcon} from "../icons/GoalIcon";

const useStyles = makeStyles(theme => ({
  list: {
    width: 250,
  },
  drawer: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    position: 'fixed',
    height: '100%',
    width: '200px',
  },
  fullList: {
    width: 'auto',
  },
  menuButton: {},
  grow: {
    flexGrow: 1,
  },
}));

type Props = {};

interface Topic {
  title: string;
  path: string;
  icon: JSX.Element;
  href?: string;
}

const mapStateToProps = (state: GlobalState) => {
  const {
    information: {guid},
  } = selectUserState(state);
  return {
    guid,
  };
};

const MenuNavigation: FC<Props> = () => {
  const {guid} = useSelector(mapStateToProps);
  const topics: Topic[] = [
    {
      title: 'Goals',
      path: '/strategy/objectives/',
      icon: <GoalIcon size={{width: '24px', height: '24px'}} />,
    },
    {
      title: 'Activities',
      path: '/tactical/activities/',
      icon: <ActivityIcon size={{width: '24px', height: '24px'}} />,
    },
    {
      title: 'History',
      path: `/${guid}/history/`,
      icon: <HistoryIcon style={{fontSize: '24px'}} />,
    },
    {
      title: 'Settings',
      path: '/settings',
      icon: <SettingsIcon />,
    },
  ];
  const classes = useStyles();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  const getListItem = (index: number, topic: Topic) => {
    return (
      <ListItem
        button
        style={{
          backgroundColor:
            index % 2 === 0 ? 'rgba(10,10,10, .05)' : 'rgba(0,0,0,0)',
        }}>
        <ListItemIcon>{topic.icon || <MailIcon />}</ListItemIcon>
        <ListItemText primary={topic.title} />
      </ListItem>
    );
  };

  const menuTopics = [
    {
      title: 'Home',
      path: '/',
      icon: <HomeIcon />,
    },
    ...topics,
  ];
  const fullList = (
    <div className={classes.fullList}>
      <List>
        {menuTopics.map((topic, index) =>
          topic.path ? (
            <Link
              key={topic.title}
              to={topic.path}
              style={{textDecoration: 'none', color: 'inherit'}}>
              {getListItem(index, topic)}
            </Link>
          ) : (
            <a
              key={topic.title}
              href={topic.href}
              target={'_blank'}
              style={{textDecoration: 'none', color: 'inherit'}}>
              {getListItem(index, topic)}
            </a>
          ),
        )}
      </List>
    </div>
  );
  const slideProps: Partial<SlideProps> = {
    // @ts-ignore real
    className: classes.drawer,
  };
  return (
    <div>
      <IconButton
        edge="start"
        className={classes.menuButton}
        color="inherit"
        onClick={toggleDrawer(true)}
        aria-label="Menu">
        <MenuIcon />
      </IconButton>
      <Drawer
        anchor="left"
        open={drawerOpen}
        SlideProps={slideProps}
        onClose={toggleDrawer(false)}>
        <div
          tabIndex={0}
          role="button"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}>
          {fullList}
        </div>
      </Drawer>
    </div>
  );
};

export default MenuNavigation;
