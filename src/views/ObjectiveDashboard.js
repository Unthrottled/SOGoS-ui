import React from "react";
import FaceIcon from '@material-ui/icons/Face';
import SaveIcon from '@material-ui/icons/Save';
import DoneIcon from '@material-ui/icons/Done';
import AddIcon from '@material-ui/icons/Add';
import {connect} from "react-redux";
import LoggedInLayout from "./LoggedInLayout";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import {makeStyles} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Fab from "@material-ui/core/Fab";

const useStyles = makeStyles(theme => ({
  chip: {},
  keyResults: {
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    margin: theme.spacing(2),
    borderRadius: theme.shape.borderRadius
  },
  avatar: {
    background: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
  },
  save: {
    position: 'relative',
    top: theme.spacing(1),
    right: theme.spacing(1),
  },
}));

const ObjectiveDashboard = ({fullName, match: {params: {objectiveId}}}) => {
  const classes = useStyles();
  const deleteCategory = (categoryId: string) => {
    console.log(`deleted ${categoryId}`);
  };
  const keyResults = [
    {
      content: 'Sweg'
    },
    {
      content: 'Yolo'
    },
  ];
  return (
    <LoggedInLayout>
      <h3>What's up {fullName}?</h3>
      <Typography>
        Dis is objective id {objectiveId}
      </Typography>
      <Chip
        icon={<FaceIcon/>}
        label={"Some Category"}
        className={classes.chip}
        color={'primary'}
        onDelete={() => deleteCategory('categoryId')}
      />
      <Button variant={'contained'}
              color={'primary'}
              className={classes.button}>
        <AddIcon/> Add Key Result
      </Button>
      <div className={classes.keyResults}>
        <List>
          {keyResults.map((topic) => (
            <ListItem>
              <ListItemAvatar>
                <Avatar className={classes.avatar}>
                  <DoneIcon/>
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={topic.content}/>
            </ListItem>
          ))}
        </List>
      </div>
      <Fab color={'primary'} className={classes.save}>
        <SaveIcon/>
      </Fab>
    </LoggedInLayout>
  );
};

const mapStateToProps = state => {
  const {user: {information: {fullName}}} = state;
  return {
    fullName,
  }
};

export default connect(mapStateToProps)(ObjectiveDashboard);
