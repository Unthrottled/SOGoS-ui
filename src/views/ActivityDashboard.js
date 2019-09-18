import React, {useState} from "react";
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckIcon from '@material-ui/icons/Check';
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
import {completedObjective, createdObjective, deletedObjective, updatedObjective} from "../actions/StrategyActions";
import type {Objective} from "../types/StrategyModels";
import {withRouter} from "react-router-dom";
import {components} from "./MultiSelectComponents";
import {ColorPicker} from "./ColorPicker";
import {MountainIcon} from "./MountainIcon";
import {PopupModal} from "./PopupModal";

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

const ActivityDashboard = ({dispatch, objectives, history, fullName, match: {params: {activityId}}}) => {
  const classes = useStyles();
  const theme = useTheme();
  const rememberedObjective = objectives[activityId];

  const defaultSky = {
    hex: '#86a4f3',
    opacity: 1,
  };
  const objective: Objective = objectives[activityId] ||
    {
      valueStatement: '',
      iconCustomization: {
        background: defaultSky
      },
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
      id: activityId,
      valueStatement: objectiveValue,
      antecedenceTime: new Date().getTime(),
      keyResults,
      iconCustomization: {
        background: skyColor,
      }
    };
    if (!objectives[objective.id]) {
      dispatch(createdObjective(objective));
    } else {
      dispatch(updatedObjective(objective));
    }
    history.push('/tactical/activities/')
  };

  const discardChanges = () => {
    history.push('/tactical/activities/');
  };

  const wipeObjectiveOffOfTheFaceOfThePlanet = () => {
    dispatch(deletedObjective(objective));
    history.push('/tactical/activities/')
  };
  const completeThatObjectiveYo = () => {
    dispatch(completedObjective(objective));
    history.push('/tactical/activities/')
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
  const [finnaComplete, setFinnaComplete] = useState(false);

  const handleChangeMulti = (value) => setMulti(value);

  const iconCustomization = objective.iconCustomization;
  const [skyColor, setSkyColor] = useState((iconCustomization && iconCustomization.background) || defaultSky);
  const dismissDeletionWindow = () => setFinnaDelete(false);
  const dismissCompletionWindow = () => setFinnaComplete(false);
  return (
    <LoggedInLayout>
      <h3>What's up {fullName}?</h3>
      <Typography>
        Dis is activity id {activityId}
      </Typography>
      <div className={classes.inputContainer}>
        <MountainIcon skyColor={skyColor}/>
        <ColorPicker onSelect={setSkyColor}/>
        <TextField
          className={classes.textField}
          label={'What is it you do?'}
          placeholder={'Coding'}
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
            placeholder: 'Give your activity categories!',
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
        <Fab color={'primary'}
             className={classes.save}
             onClick={discardChanges}
        >
          <CancelIcon/>
        </Fab>
        {
          rememberedObjective ? (
            <Fab color={'primary'}
                 className={classes.save}
                 onClick={() => setFinnaDelete(true)}
            >
              <DeleteIcon/>
            </Fab>
          ) : null
        }
        {
          rememberedObjective ? (
            <Fab color={'primary'}
                 className={classes.save}
                 onClick={() => setFinnaComplete(true)}
            >
              <CheckIcon/>
            </Fab>
          ) : null
        }
      </div>
      <PopupModal open={finnaDelete}
                  negativeActionText={"No, I'll keep it"}
                  positiveActionText={"Yes, Get rid of it"}
                  title={"Welcome to the Danger Zone!"}
                  onDismiss={dismissDeletionWindow}
                  onNegativeAction={dismissDeletionWindow}
                  onPositiveAction={wipeObjectiveOffOfTheFaceOfThePlanet}
                  contents={"Woah! Are you sure you want to delete this objective?"}
      />
      <PopupModal open={finnaComplete}
                  negativeActionText={"No, I'm still working"}
                  positiveActionText={"Yes, I'm done"}
                  title={"Congratulations!"}
                  onDismiss={dismissCompletionWindow}
                  onNegativeAction={dismissCompletionWindow}
                  onPositiveAction={completeThatObjectiveYo}
                  contents={"Excellent work! Are ready to complete your objective?"}
      />
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

export default connect(mapStateToProps)(withRouter(ActivityDashboard));
