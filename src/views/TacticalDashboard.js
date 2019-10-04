import React from "react";
import {connect} from "react-redux";
import LoggedInLayout from "./LoggedInLayout";
import Typography from "@material-ui/core/Typography";
import {withRouter} from "react-router-dom";
import {Card, makeStyles} from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import CardActionArea from "@material-ui/core/CardActionArea";
import {TacticalActivityIcon} from "./TacticalActivityIcon";

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 345,
    margin: 'auto',
  },
  goalIcon: {
    padding: theme.spacing(2)
  }
}));

const TacticalDashboard = ({history}) => {
  const classes = useStyles();
  return (
    <LoggedInLayout>
      <Card className={classes.card}>
        <CardActionArea onClick={() => history.push('./activities/')}>
          <div className={classes.goalIcon}>
            <TacticalActivityIcon/>
          </div>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              Activity Creation
            </Typography>
            <Typography gutterBottom variant="body2" color="textSecondary" component="p">
              This is how you reach your goals.
            </Typography>
            <Typography gutterBottom variant="body2" color="textSecondary" component="p">
              The things you do are related to a goal you want to accomplish.
              Otherwise you would not be doing it, right?
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

export default connect(mapStateToProps)(withRouter(TacticalDashboard));
