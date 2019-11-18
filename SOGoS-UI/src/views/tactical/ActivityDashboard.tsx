import React, {FC, useState} from "react";
import ArchiveIcon from '@material-ui/icons/Archive';
import UnArchiveIcon from '@material-ui/icons/Unarchive';
import {connect, DispatchProp} from "react-redux";
import LoggedInLayout from "../components/LoggedInLayout";
import Typography from "@material-ui/core/Typography";
import {emphasize, makeStyles, useTheme} from '@material-ui/core/styles';
import TextField from "@material-ui/core/TextField";
import ReactSelect from 'react-select/creatable';
import {useHistory, useParams} from "react-router-dom";
import {components} from "../components/MultiSelectComponents";
import {ColorPicker} from "../components/ColorPicker";
import {PopupModal} from "../components/PopupModal";
import {
  createCreatedTacticalActivityEvent,
  createHideTacticalActivityEvent,
  createRequestToDeleteTacticalActivityEvent,
  createShowTacticalActivityEvent,
  createUpdatedTacticalActivityEvent
} from "../../events/TacticalEvents";
import {GlobalState, selectTacticalActivityState, selectUserState} from "../../reducers";
import {ActivityIcon, defaultBackground, defaultLine} from "../icons/ActivityIcon";
import Container from "@material-ui/core/Container";
import {PersistActions} from "../components/PersistActions";
import {mapTacticalActivitiesToID} from "../history/PieFlavored";
import {NumberDictionary, StringDictionary} from "../../types/BaseTypes";
import {TacticalActivity} from "../../types/TacticalTypes";

const suggestions = [
  {label: 'Deliberate Practice'},
  {label: 'Physical'},
  {label: 'Cognitive'},
  {label: 'Overhead'},
  {label: 'Pastime'},
  {label: 'Leisure'},
].map(suggestion => ({
  value: suggestion.label,
  label: suggestion.label,
}));

const useStyles = makeStyles(theme => (
  {
    headerContent: {
      borderRadius: theme.spacing(1),
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(6, 0, 6),
      marginBottom: theme.spacing(1),
    },
    inputContainer: {
      width: '100%',
      background: theme.palette.background.paper,
      color: theme.palette.common.black,
      borderRadius: theme.spacing(1),
    },
    cardContent: {
      maxWidth: theme.spacing(75),
      margin: 'auto',
      padding: theme.spacing(3),
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
    persistActions: {
      marginTop: theme.spacing(2),
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

interface Props {
  activities: NumberDictionary<TacticalActivity>,
  archivedActivities: StringDictionary<TacticalActivity>,
}

const ActivityDashboard: FC<DispatchProp & Props> = ({
                                                       dispatch,
                                                       activities,
                                                       archivedActivities,
                                                     }
) => {
  const classes = useStyles();
  const theme = useTheme();
  const {activityId} = useParams<{ activityId: string }>();
  const mappedTacticalActivities = {
    ...mapTacticalActivitiesToID(activities),
    ...archivedActivities
  };
  const rememberedTacticalObjective = mappedTacticalActivities[activityId];

  const currentTacticalActivity: TacticalActivity = mappedTacticalActivities[activityId] ||
    {
      name: '',
      iconCustomization: {
        background: defaultBackground,
        line: defaultLine
      },
      rank: Object.keys(activities).length,
      categories: [],
    };

  const [tacticalActivityName, setTacticalActivityName] = useState(currentTacticalActivity.name);
  const handleTacticalNameChange = (event: any) => setTacticalActivityName(event.target.value);

  const [categoryValues, setMulti] = useState<{ value: string, label: string }[]>(currentTacticalActivity.categories ?
    currentTacticalActivity.categories.map(catVal => ({value: catVal, label: catVal})) : []);

  const history = useHistory();
  const saveTacticalActivity = () => {
    const tacticalActivity: TacticalActivity = {
      id: activityId,
      name: tacticalActivityName,
      rank: currentTacticalActivity.rank,
      antecedenceTime: new Date().getTime(),
      iconCustomization: {
        background: backgroundColor,
        line: lineColor,
      },

      categories: categoryValues.map(catVal => catVal.value)
    };
    if (!mappedTacticalActivities[tacticalActivity.id]) {
      dispatch(createCreatedTacticalActivityEvent(tacticalActivity));
      history.push(`/tactical/activities/${activityId}/strategy/association`)
    } else {
      dispatch(createUpdatedTacticalActivityEvent(tacticalActivity));
      history.goBack()
    }
  };

  const hideTacticalActivity = () => {
    dispatch(createHideTacticalActivityEvent(mappedTacticalActivities[activityId]));
    history.goBack();
  };

  const unHideTacticalActivity = () => {
    dispatch(createShowTacticalActivityEvent(mappedTacticalActivities[activityId]));
    history.goBack();
  };

  const discardChanges = () => {
    history.goBack();
  };

  const wipeObjectiveOffOfTheFaceOfThePlanet = () => {
    dispatch(createRequestToDeleteTacticalActivityEvent(currentTacticalActivity));
    history.goBack()
  };

  const selectStyles = {
    input: (base: any) => ({
      ...base,
      color: theme.palette.text.primary,
      '& input': {
        font: 'inherit',
      },
    }),
  };

  const [finnaDelete, setFinnaDelete] = useState(false);

  const handleChangeMulti = (value: any) => setMulti(value);

  const iconCustomization = currentTacticalActivity.iconCustomization;
  const [backgroundColor, setBackgroundColor] = useState((iconCustomization && iconCustomization.background) || defaultBackground);
  const [lineColor, setLineColor] = useState((iconCustomization && iconCustomization.line) || defaultLine);
  const dismissDeletionWindow = () => setFinnaDelete(false);

  const archiveAction = currentTacticalActivity.hidden ? (
    {
      onComplete: unHideTacticalActivity,
      completionTitle: 'Show Activity',
      completionIcon: UnArchiveIcon,
    }
  ) : (
    {
      onComplete: hideTacticalActivity,
      completionTitle: 'Hide Activity',
      completionIcon: ArchiveIcon,
    }
  );

  return (
    <LoggedInLayout>
      <div className={classes.headerContent}>
        <Container maxWidth={'sm'}>
          <Typography component={'h1'}
                      variant={'h4'}
                      align={'center'}
                      color={'textPrimary'}
                      gutterBottom>
            Your Activity
          </Typography>
          <Typography variant="h6" align="center" color="textSecondary" paragraph>
            This is something you spend your time on.
            Whether or not it helps you reach your goal is up to you.
            Remember spend your time wisely, because you aren't getting it back!
          </Typography>
        </Container>
      </div>
      <div className={classes.inputContainer}>
        <div className={classes.cardContent}>
          <div style={{display: 'flex', justifyContent: 'space-evenly'}}>
            <ActivityIcon
              backgroundColor={backgroundColor}
              lineColor={lineColor}
            />
            <div style={{display: 'flex-column', alignItems: 'center', justifyContent: 'center'}}>
              <ColorPicker defaultColor={lineColor}
                           onSelect={setLineColor}
                           label={'Pulse Color'}
              />
              <ColorPicker defaultColor={backgroundColor}
                           onSelect={setBackgroundColor}
                           label={'Background Color'}
              />
            </div>
          </div>
          <TextField
            className={classes.textField}
            label={'What is it you do?'}
            placeholder={'Stuff ;)'}
            variant={'outlined'}
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
            value={categoryValues}
            onChange={handleChangeMulti}
            isMulti
          />
          <div className={classes.persistActions}>
            <PersistActions
              {...{
                ...(rememberedTacticalObjective ? {onDelete: () => setFinnaDelete(true)} : {}),
                ...(rememberedTacticalObjective ? archiveAction : {})
              }}
              onCancel={discardChanges}
              onSave={saveTacticalActivity}/>
          </div>
        </div>
      </div>
      <PopupModal open={finnaDelete}
                  negativeActionText={"No, I'll keep it"}
                  positiveActionText={"Yes, Get rid of it"}
                  title={"Welcome to the Danger Zone!"}
                  onDismiss={dismissDeletionWindow}
                  onNegativeAction={dismissDeletionWindow}
                  onPositiveAction={wipeObjectiveOffOfTheFaceOfThePlanet}
                  contents={"Woah! Are you sure you want to delete this activity? You'll lose all history of what you have done!"}
      />
    </LoggedInLayout>
  );
};

const mapStateToProps = (state: GlobalState) => {
  const {information: {fullName}} = selectUserState(state);
  const {activities, archivedActivities} = selectTacticalActivityState(state);
  return {
    fullName,
    activities,
    archivedActivities,
  };
};

export default connect(mapStateToProps)(ActivityDashboard);
