import React, {useState} from "react";
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckIcon from '@material-ui/icons/Check';
import DeleteIcon from '@material-ui/icons/Delete';
import {connect} from "react-redux";
import LoggedInLayout from "./LoggedInLayout";
import Typography from "@material-ui/core/Typography";
import {emphasize, makeStyles, useTheme} from '@material-ui/core/styles';
import Fab from "@material-ui/core/Fab";
import TextField from "@material-ui/core/TextField";
import ReactSelect from 'react-select/creatable';
import {withRouter} from "react-router-dom";
import {components} from "./MultiSelectComponents";
import {ColorPicker} from "./ColorPicker";
import {MountainIcon} from "./MountainIcon";
import {PopupModal} from "./PopupModal";
import {
  createCreatedTacticalActivityEvent,
  createDeletedTacticalActivityEvent,
  createHideTacticalActivityEvent,
  createUpdatedTacticalActivityEvent
} from "../events/TacticalEvents";
import type {TacticalActivity} from "../types/TacticalModels";
import {selectTacticalActivityState, selectUserState} from "../reducers";
import {ActivityIcon, defaultBackground, defaultLine} from "./ActivityIcon";

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

const ActivityDashboard = ({dispatch, activities, history, fullName, match: {params: {activityId}}}) => {
  const classes = useStyles();
  const theme = useTheme();
  const rememberedTacticalObjective = activities[activityId];

  const currentTacticalActivity: TacticalActivity = activities[activityId] ||
    {
      name: '',
      iconCustomization: {
        background: defaultBackground,
        line: defaultLine
      },
    };

  const [tacticalActivityName, setTacticalActivityName] = useState(currentTacticalActivity.name);
  const handleTacticalNameChange = event => setTacticalActivityName(event.target.value);

  const saveTacticalActivity = () => {
    const tacticalActivity: TacticalActivity = {
      id: activityId,
      name: tacticalActivityName,
      antecedenceTime: new Date().getTime(),
      iconCustomization: {
        background: backgroundColor,
        line: lineColor,
      }
    };
    if (!activities[tacticalActivity.id]) {
      dispatch(createCreatedTacticalActivityEvent(tacticalActivity));
    } else {
      dispatch(createUpdatedTacticalActivityEvent(tacticalActivity));
    }
    history.push('/tactical/activities/')
  };

  const discardChanges = () => {
    history.push('/tactical/activities/');
  };

  const wipeObjectiveOffOfTheFaceOfThePlanet = () => {
    dispatch(createDeletedTacticalActivityEvent(currentTacticalActivity));
    history.push('/tactical/activities/')
  };
  const completeThatObjectiveYo = () => {
    dispatch(createHideTacticalActivityEvent(currentTacticalActivity));
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

  const iconCustomization = currentTacticalActivity.iconCustomization;
  const [backgroundColor, setBackgroundColor] = useState((iconCustomization && iconCustomization.background) || defaultBackground);
  const [lineColor, setLineColor] = useState((iconCustomization && iconCustomization.line) || defaultLine);
  const dismissDeletionWindow = () => setFinnaDelete(false);
  const dismissCompletionWindow = () => setFinnaComplete(false);
  return (
    <LoggedInLayout>
      <h3>What's up {fullName}?</h3>
      <Typography>
        Dis is activity id {activityId}
      </Typography>
      <div className={classes.inputContainer}>
        <ActivityIcon
          backgroundColor={backgroundColor}
          lineColor={lineColor}
        />
        <ColorPicker defaultColor={backgroundColor} onSelect={setBackgroundColor}/>
        <ColorPicker defaultColor={lineColor} onSelect={setLineColor}/>
        <TextField
          className={classes.textField}
          label={'What is it you do?'}
          placeholder={'Coding'}
          variant={'filled'}
          margin={'normal'}
          {...(currentTacticalActivity ? {defaultValue: currentTacticalActivity.name} : {})}
          onBlur={handleTacticalNameChange}
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
        <Fab color={'primary'}
             className={classes.save}
             onClick={saveTacticalActivity}
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
          rememberedTacticalObjective ? (
            <Fab color={'primary'}
                 className={classes.save}
                 onClick={() => setFinnaDelete(true)}
            >
              <DeleteIcon/>
            </Fab>
          ) : null
        }
        {
          rememberedTacticalObjective ? (
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
  const {information: {fullName}} = selectUserState(state);
  const {activities} = selectTacticalActivityState(state);
  return {
    fullName,
    activities,
  };
};

export default connect(mapStateToProps)(withRouter(ActivityDashboard));
