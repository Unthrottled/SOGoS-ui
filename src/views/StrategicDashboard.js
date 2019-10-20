import React from "react";
import {connect} from "react-redux";
import LoggedInLayout from "./LoggedInLayout";
import Typography from "@material-ui/core/Typography";
import {withRouter} from "react-router-dom";
import {Card, makeStyles} from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import CardActionArea from "@material-ui/core/CardActionArea";
import {GoalIcon} from "./GoalIcon";
import Container from "@material-ui/core/Container";
import {StrategyIcon} from "./StrategyIcon";

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 345,
    margin: 'auto',
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

const StrategicDashboard = ({history}) => {
  const classes = useStyles();
  return (
    <LoggedInLayout>
      <div className={classes.headerContent}>
        <Container maxWidth={'sm'}>
          <Typography component={'h1'}
                      variant={'h2'}
                      align={'center'}
                      color={'textPrimary'}
                      gutterBottom>
            Command Center
          </Typography>
          <Typography variant="h5" align="center" color="textSecondary" paragraph>
            Something short and leading about the collection below—its contents, the creator, etc.
            Make it short and sweet, but not too short so folks don&apos;t simply skip over it
            entirely.
          </Typography>
          <StrategyIcon/>
        </Container>
      </div>
      <Card className={classes.card}>
        <CardActionArea onClick={() => history.push('./objectives/')}>
          <div className={classes.goalIcon}>
            <GoalIcon/>
          </div>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              Goal Setting
            </Typography>
            <Typography gutterBottom variant="body2" color="textSecondary" component="p">
              We all have things that we want to accomplish.
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              Go here to choose your <strong>Top 3</strong> goals.
              You can have up to 5 but limit to what is important.
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </LoggedInLayout>
  );
};

const mapStateToProps = state => {
  return {}
};

export default connect(mapStateToProps)(withRouter(StrategicDashboard));
