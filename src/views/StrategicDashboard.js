import React from "react";
import {connect} from "react-redux";
import LoggedInLayout from "./LoggedInLayout";
import Typography from "@material-ui/core/Typography";
import {withRouter} from "react-router-dom";
import {Card, makeStyles} from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import CardActionArea from "@material-ui/core/CardActionArea";
import {GoalIcon} from "./GoalIcon";

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 345,
    margin: 'auto',
  },
  goalIcon: {
    padding: theme.spacing(2)
  }
}));

const StrategicDashboard = ({history}) => {
  const classes = useStyles();
  return (
    <LoggedInLayout>
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
              Go here to choose your <strong>Top 5</strong> goals.
              Ideally you want to have at most 3
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
