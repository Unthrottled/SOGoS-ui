import React from "react";
import {connect} from "react-redux";
import LoggedInLayout from "./LoggedInLayout";
import Typography from "@material-ui/core/Typography";
import {withRouter} from "react-router-dom";
import {Card, makeStyles} from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import CardActionArea from "@material-ui/core/CardActionArea";
import {TacticalActivityIcon} from "./TacticalActivityIcon";
import Container from "@material-ui/core/Container";
import {TacticalIcon} from "./TacticalIcon";

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

const TacticalDashboard = ({history}) => {
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
            Get Tactical
          </Typography>
          <Typography variant="h5" align="center" color="textSecondary" paragraph>
            Those goals aren't going to accomplish themselves!
            Figure out nitty-gritty of getting the job done.
          </Typography>
          <TacticalIcon/>
        </Container>
      </div>
      <Card className={classes.card}>
        <CardActionArea onClick={() => history.push('./activities/')}>
          <div className={classes.cardContent}>
            <div className={classes.goalIcon}>
              <TacticalActivityIcon/>
            </div>
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Activity Hub
              </Typography>
              <Typography gutterBottom variant="body2" color="textSecondary" component="p">
                The things you do are related to a goal you want to accomplish.
                Otherwise you would not be doing it, right?
              </Typography>
            </CardContent>
          </div>
        </CardActionArea>
      </Card>
    </LoggedInLayout>
  );
};

const mapStateToProps = state => {
  return {}
};

export default connect(mapStateToProps)(withRouter(TacticalDashboard));
