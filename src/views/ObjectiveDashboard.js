import React, {useState} from "react";
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import DoneIcon from '@material-ui/icons/Done';
import AddIcon from '@material-ui/icons/Add';
import {connect} from "react-redux";
import LoggedInLayout from "./LoggedInLayout";
import Typography from "@material-ui/core/Typography";
import {emphasize, makeStyles, useTheme} from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Fab from "@material-ui/core/Fab";
import uuid from "uuid/v4";
import TextField from "@material-ui/core/TextField";
import ReactSelect from 'react-select/creatable';
import {createdObjective, deletedObjective, updatedObjective} from "../actions/StrategyActions";
import type {Objective} from "../types/StrategyModels";
import {withRouter} from "react-router-dom";
import {components} from "./MultiSelectComponents";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import Goal from '../images/Goal.svg';
import ReactSVG from 'react-svg';

const GoalSVG = () => (<ReactSVG src={Goal} beforeInjection={(svg) => {
  svg.setAttribute('width', '100px');
  svg.setAttribute('height', '100px');
}}/>);

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const suggestions = [
  {label: 'Technical'},
  {label: 'Recovery'},
  {label: 'Social'},
  {label: 'Financial'},
  {label: 'Education'},
  {label: 'Career'},
].map(suggestion => ({
  value: suggestion.label,
  label: suggestion.label,
}));

const useStyles = makeStyles(theme => (
  {
    inputContainer: {
      background: theme.palette.primary.main
    },
    root: {
      flexGrow: 1,
      height: 250,
    },
    input: {
      display: 'flex',
      padding: 0,
      height: 'auto',
    },
    valueContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      flex: 1,
      alignItems: 'center',
      overflow: 'hidden',
    },
    chip: {
      margin: theme.spacing(0.5, 0.25),
    },
    chipFocused: {
      backgroundColor: emphasize(
        theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
        0.08,
      ),
    },
    noOptionsMessage: {
      padding: theme.spacing(1, 2),
    },
    singleValue: {
      fontSize: 16,
    },
    placeholder: {
      position: 'absolute',
      left: 2,
      bottom: 6,
      fontSize: 16,
    },
    paper: {
      position: 'absolute',
      zIndex: 1,
      marginTop: theme.spacing(1),
      left: 0,
      right: 0,
    },
    divider: {
      height: theme.spacing(2),
    },
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
    textField: {
      width: '100%',
    },
  }
));

const ObjectiveDashboard = ({dispatch, objectives, history, fullName, match: {params: {objectiveId}}}) => {
  const classes = useStyles();
  const theme = useTheme();
  const rememberedObjective = objectives[objectiveId];

  const objective: Objective = objectives[objectiveId] ||
    {
      valueStatement: '',
      keyResults: [
        {
          id: uuid(),
        }
      ]
    };
  const [keyResults, setKeyResults] = useState(objective.keyResults);
  const [objectiveValue, setObjective] = useState(objective.valueStatement);
  const handleObjectiveChange = event => setObjective(event.target.value);
  const updateResult = (resultId, resultValue) => {
    keyResults.find(result => result.id === resultId).valueStatement = resultValue

  };
  const addKeyResult = () => {
    setKeyResults([
      ...keyResults,
      {
        id: uuid(),
        antecedenceTime: new Date().getTime(),
      }
    ])

  };
  const saveObjective = () => {
    const objective: Objective = {
      id: objectiveId,
      valueStatement: objectiveValue,
      antecedenceTime: new Date().getTime(),
      keyResults
    };
    if(!objectives[objective.id]){
      dispatch(createdObjective(objective));
    } else {
      dispatch(updatedObjective(objective));
    }
    history.push('/strategy/objectives/')
  };

  const wipeObjectiveOffOfTheFaceOfThePlanet = () => {
    dispatch(deletedObjective(objective));
    history.push('/strategy/objectives/')
  };

  const selectStyles = {
    input: base => ({
      ...base,
      color: theme.palette.text.primary,
      '& input': {
        font: 'inherit',
      },
    }),
  };
  const [multi, setMulti] = React.useState(null);
  const [finnaDelete, setFinnaDelete] = useState(false);

  const handleChangeMulti = (value) => setMulti(value);

  const [selectedIcon, setSelectedIcon] = useState("star");

  const dismissDeletionWindow = ()=>setFinnaDelete(false);
  return (
    <LoggedInLayout>
      <h3>What's up {fullName}?</h3>
      <Typography>
        Dis is objective id {objectiveId}
      </Typography>
      <div className={classes.inputContainer}>
        <TextField
          className={classes.textField}
          label={'What you do want to accomplish?'}
          placeholder={'I want to use my time better.'}
          variant={'filled'}
          margin={'normal'}
          {...(objective ? {defaultValue: objective.valueStatement} : {})}
          onBlur={handleObjectiveChange}
        />
        <ReactSelect
          classes={classes}
          styles={selectStyles}
          inputId="react-select-multiple"
          TextFieldProps={{
            label: 'Categories',
            InputLabelProps: {
              htmlFor: 'react-select-multiple',
              shrink: true,
            },
            placeholder: 'Give your objective categories!',
          }}
          options={suggestions}
          components={components}
          value={multi}
          onChange={handleChangeMulti}
          isMulti
        />
        <div className={classes.keyResults}>
          <List>
            {keyResults.map((topic) => (
              <ListItem key={topic.id}>
                <ListItemAvatar>
                  <Avatar className={classes.avatar}>
                    <DoneIcon/>
                  </Avatar>
                </ListItemAvatar>
                <TextField
                  className={classes.textField}
                  label={'How will you know you are successful?'}
                  placeholder={'50% of my time awake is spent doing what I want.'}
                  variant={'outlined'}
                  margin={'normal'}
                  {...(topic.valueStatement ? {defaultValue: topic.valueStatement} : {})}
                  onBlur={event => updateResult(topic.id, event.target.value)}
                />
              </ListItem>
            ))}
          </List>
        </div>
        <Button variant={'contained'}
                color={'primary'}
                onClick={addKeyResult}
                className={classes.button}>
          <AddIcon/>Add Key Result
        </Button>
        <Fab color={'primary'}
             className={classes.save}
             onClick={saveObjective}
        >
          <SaveIcon/>
        </Fab>
        {
          rememberedObjective ? (
            <Fab color={'primary'}
                 className={classes.save}
                 onClick={()=>setFinnaDelete(true)}
            >
              <DeleteIcon/>
            </Fab>
          ) : null
        }
      </div>
      <Dialog
        open={finnaDelete}
        TransitionComponent={Transition}
        keepMounted
        onClose={dismissDeletionWindow}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{"Welcome to the Danger Zone!"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Woah! Are you sure you want to delete this objective?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={wipeObjectiveOffOfTheFaceOfThePlanet} >
            Yes, Get rid of it
          </Button>
          <Button onClick={dismissDeletionWindow} >
            No, I'll keep it
          </Button>
        </DialogActions>
      </Dialog>
    </LoggedInLayout>
  );
};

const mapStateToProps = state => {
  const {user: {information: {fullName}}, strategy: {objectives}} = state;
  return {
    fullName,
    objectives
  }
};

export default connect(mapStateToProps)(withRouter(ObjectiveDashboard));
