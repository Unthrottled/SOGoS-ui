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
  card: {
    maxWidth: 345,
    margin: 'auto',
  },
  headerContent: {
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
            The Bridge
          </Typography>
          <Typography variant="h5" align="center" color="textSecondary" paragraph>
            Something short and leading about the collection below—its contents, the creator, etc.
            Make it short and sweet, but not too short so folks don&apos;t simply skip over it
            entirely.
          </Typography>
          <TacticalIcon />
        </Container>
      </div>
      <Card className={classes.card}>
        <CardActionArea onClick={() => history.push('./activities/')}>
          <div className={classes.goalIcon}>
            <TacticalActivityIcon/>
          </div>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              Activity Hub
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
