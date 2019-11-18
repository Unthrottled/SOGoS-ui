import React from "react";
import {connect} from "react-redux";
import LoggedInLayout from "../components/LoggedInLayout";
import Typography from "@material-ui/core/Typography";
import {useHistory} from "react-router-dom";
import {Card, makeStyles} from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import CardActionArea from "@material-ui/core/CardActionArea";
import {GoalIcon} from "../icons/GoalIcon";
import Container from "@material-ui/core/Container";
import {StrategyIcon} from "../icons/StrategyIcon";
import {GlobalState} from "../../reducers";

const useStyles = makeStyles(theme => ({
  cardContent: {
    maxWidth: 345,
    margin: 'auto',
  },
  card: {
    width: '100%',
  },
  headerContent: {
    borderRadius: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6, 0, 6),
    marginBottom: theme.spacing(1),
  },
  goalIcon: {
    padding: theme.spacing(2)
  }
}));

const StrategicDashboard = () => {
  const classes = useStyles();
  const history = useHistory();
  return (
    <LoggedInLayout>
      <div className={classes.headerContent}>
        <Container maxWidth={'sm'}>
          <Typography component={'h1'}
                      variant={'h2'}
                      align={'center'}
                      color={'textPrimary'}
                      gutterBottom>
            Strategize
          </Typography>
          <Typography variant="h5" align="center" color="textSecondary" paragraph>
            What does it mean to succeed?
            Figure out what you want to do and how you know you accomplished it.
          </Typography>
          <StrategyIcon/>
        </Container>
      </div>
      <Card className={classes.card}>
        <CardActionArea onClick={() => history.push('./objectives/')}>
          <div className={classes.cardContent}>
            <div className={classes.goalIcon}>
              <GoalIcon/>
            </div>
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Goal Setting
              </Typography>
              <Typography gutterBottom variant="body2" color="textSecondary" component="p">
                What do you want to accomplish?
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Choose your <strong>Top 3</strong> goals.
                You can have up to 5, but limit it to what is important.
              </Typography>
            </CardContent>
          </div>
        </CardActionArea>
      </Card>
    </LoggedInLayout>
  );
};

const mapStateToProps = (state : GlobalState) => {
  return {}
};

export default connect(mapStateToProps)(StrategicDashboard);
