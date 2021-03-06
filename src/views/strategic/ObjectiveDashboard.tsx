import React, {FC, useState} from 'react';
import isEmpty from 'lodash/isEmpty';
import DeleteIcon from '@material-ui/icons/Delete';
import DoneIcon from '@material-ui/icons/Done';
import AddIcon from '@material-ui/icons/Add';
import {connect, DispatchProp} from 'react-redux';
import LoggedInLayout from '../components/LoggedInLayout';
import Typography from '@material-ui/core/Typography';
import {emphasize, makeStyles, useTheme} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import uuid from 'uuid/v4';
import TextField from '@material-ui/core/TextField';
import ReactSelect from 'react-select/creatable';
import {useHistory, useParams} from 'react-router-dom';
import {components} from '../components/MultiSelectComponents';
import {ColorPicker} from '../components/ColorPicker';
import {MountainIcon} from '../icons/MountainIcon';
import {PopupModal} from '../components/PopupModal';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import {PersistActions} from '../components/PersistActions';
import {KeyResult, Objective} from '../../types/StrategyTypes';
import {NumberDictionary, StringDictionary} from '../../types/BaseTypes';
import {
  createCompletedObjectiveEvent,
  createCreatedObjectiveEvent,
  createDeletedObjectiveEvent,
  createUpdatedObjectiveEvent,
} from '../../events/StrategyEvents';
import {GlobalState, selectStrategyState, selectTacticalActivityState} from '../../reducers';
import {TacticalActivity} from "../../types/TacticalTypes";

const suggestions = [
  {label: 'Technical'},
  {label: 'Health'},
  {label: 'Creative'},
  {label: 'Financial'},
  {label: 'Education'},
  {label: 'Recovery'},
  {label: 'Career'},
  {label: 'Social'},
].map(suggestion => ({
  value: suggestion.label,
  label: suggestion.label,
}));

const useStyles = makeStyles(theme => ({
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
      theme.palette.type === 'light'
        ? theme.palette.grey[300]
        : theme.palette.grey[700],
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
    borderRadius: theme.shape.borderRadius,
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
}));

interface Props {
  objectives: StringDictionary<Objective>;
  activities: NumberDictionary<TacticalActivity>;
}

const ObjectiveDashboard: FC<DispatchProp & Props> = ({
                                                        dispatch,
                                                        objectives,
                                                        activities,
                                                      }) => {
  const classes: any = useStyles();
  const theme = useTheme();
  const {objectiveId} = useParams<{ objectiveId: string }>();
  const rememberedObjective = objectives[objectiveId];

  const defaultSky = {
    hex: '#86a4f3',
    opacity: 1,
  };
  const objective: Objective = objectives[objectiveId] || {
    valueStatement: '',
    iconCustomization: {
      background: defaultSky,
    },
    categories: [],
    keyResults: [
      {
        id: uuid(),
      },
    ],
  };
  const [keyResults, setKeyResults] = useState<KeyResult[]>(
    objective.keyResults,
  );
  const [objectiveValue, setObjective] = useState(objective.valueStatement);
  const handleObjectiveChange = (event: any) =>
    setObjective(event.target.value);
  const updateResult = (resultId: string, resultValue: string) => {
    const foundKeyResult = keyResults.find(result => result.id === resultId);
    if (foundKeyResult) {
      foundKeyResult.valueStatement = resultValue;
    }
  };
  const addKeyResult = () => {
    setKeyResults([
      ...keyResults,
      {
        id: uuid(),
        antecedenceTime: new Date().getTime(),
        valueStatement: '',
        objectiveId: objectiveId,
      },
    ]);
  };
  const removeKeyResult = (idToRemove: string) => {
    setKeyResults(keyResults.filter(keyResult => keyResult.id !== idToRemove));
  };

  const [categoryValues, setMulti] = useState<{ value: string; label: string }[]>(
    objective.categories
      ? objective.categories.map((catVal: string) => ({
        value: catVal,
        label: catVal,
      }))
      : [],
  );

  const history = useHistory();

  const saveObjective = () => {
    const newObjective: Objective = {
      id: objectiveId,
      valueStatement: objectiveValue,
      antecedenceTime: new Date().getTime(),
      keyResults,
      iconCustomization: {
        background: skyColor,
      },
      associatedActivities:
        (rememberedObjective && rememberedObjective.associatedActivities) || [],
      categories: categoryValues.map(catVal => catVal.value),
    };
    if (!objectives[newObjective.id] && !isEmpty(activities)) {
      dispatch(createCreatedObjectiveEvent(newObjective));
      history.push(
        `/strategy/objectives/${newObjective.id}/tactics/association`,
      );
    } else {
      dispatch(createUpdatedObjectiveEvent(newObjective));
      history.goBack();
    }
  };

  const discardChanges = () => {
    history.goBack();
  };

  const wipeObjectiveOffOfTheFaceOfThePlanet = () => {
    dispatch(createDeletedObjectiveEvent(objective));
    history.goBack();
  };
  const completeThatObjectiveYo = () => {
    dispatch(createCompletedObjectiveEvent(objective));
    history.goBack();
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
  const [finnaComplete, setFinnaComplete] = useState(false);

  const handleChangeMulti = (value: any) => setMulti(value);

  const iconCustomization = objective.iconCustomization;
  const [skyColor, setSkyColor] = useState(
    (iconCustomization && iconCustomization.background) || defaultSky,
  );
  const dismissDeletionWindow = () => setFinnaDelete(false);
  const dismissCompletionWindow = () => setFinnaComplete(false);
  return (
    <LoggedInLayout>
      <div className={classes.headerContent}>
        <Container maxWidth={'sm'}>
          <Typography
            component={'h1'}
            variant={'h4'}
            align={'center'}
            color={'textPrimary'}
            gutterBottom>
            Your Objective
          </Typography>
          <Typography
            variant="h6"
            align="center"
            color="textSecondary"
            paragraph>
            Dig deep and shoot for the moon. This should be a long shot that is
            difficult to accomplish. Don't sandbag yourself, strive for
            greatness!
          </Typography>
        </Container>
      </div>
      <div className={classes.inputContainer}>
        <div className={classes.cardContent}>
          <div style={{display: 'flex', justifyContent: 'space-evenly'}}>
            <MountainIcon skyColor={skyColor}/>
            <div
              style={{
                display: 'flex-column',
                alignItems: 'center',
                justifyContent: 'center',
                margin: 'auto 0',
              }}>
              <ColorPicker
                onSelect={setSkyColor}
                defaultColor={skyColor}
                label={'Background Color'}
              />
            </div>
          </div>
          <TextField
            className={classes.textField}
            label={'What you do want to accomplish?'}
            placeholder={'I want to use my time better.'}
            variant={'outlined'}
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
            value={categoryValues}
            onChange={handleChangeMulti}
            isMulti
          />
          <List>
            {keyResults.map(topic => (
              <ListItem key={topic.id}>
                <ListItemAvatar>
                  <Avatar className={classes.avatar}>
                    <DoneIcon/>
                  </Avatar>
                </ListItemAvatar>
                <TextField
                  className={classes.textField}
                  label={'How will you know you are successful?'}
                  placeholder={
                    '50% of my time awake is spent doing what I want.'
                  }
                  variant={'outlined'}
                  margin={'normal'}
                  {...(topic.valueStatement
                    ? {defaultValue: topic.valueStatement}
                    : {})}
                  onBlur={event => updateResult(topic.id, event.target.value)}
                />
                <IconButton onClick={() => removeKeyResult(topic.id)}>
                  <DeleteIcon/>
                </IconButton>
              </ListItem>
            ))}
          </List>
          <div>
            <Button
              variant={'contained'}
              color={'secondary'}
              onClick={addKeyResult}
              className={classes.button}>
              <AddIcon/>
              Add Key Result
            </Button>
          </div>
          <div className={classes.persistActions}>
            <PersistActions
              {...{
                ...(rememberedObjective
                  ? {onDelete: () => setFinnaDelete(true)}
                  : {}),
                ...(rememberedObjective
                  ? {
                    onComplete: () => setFinnaComplete(true),
                    completionTitle: 'Complete Objective',
                  }
                  : {}),
              }}
              onCancel={discardChanges}
              onSave={saveObjective}
            />
          </div>
        </div>
      </div>
      <PopupModal
        open={finnaDelete}
        negativeActionText={"No, I'll keep it"}
        positiveActionText={'Yes, Get rid of it'}
        title={'Welcome to the Danger Zone!'}
        onDismiss={dismissDeletionWindow}
        onNegativeAction={dismissDeletionWindow}
        onPositiveAction={wipeObjectiveOffOfTheFaceOfThePlanet}
        contents={'Woah! Are you sure you want to delete this objective?'}
      />
      <PopupModal
        open={finnaComplete}
        negativeActionText={"No, I'm still working"}
        positiveActionText={"Yes, I'm done"}
        title={'Congratulations!'}
        onDismiss={dismissCompletionWindow}
        onNegativeAction={dismissCompletionWindow}
        onPositiveAction={completeThatObjectiveYo}
        contents={'Excellent work! Are ready to complete your objective?'}
      />
    </LoggedInLayout>
  );
};

const mapStateToProps = (state: GlobalState): Props => {
  const {objectives} = selectStrategyState(state);
  const {activities} = selectTacticalActivityState(state);
  return {
    objectives,
    activities,
  };
};

export default connect(mapStateToProps)(ObjectiveDashboard);
