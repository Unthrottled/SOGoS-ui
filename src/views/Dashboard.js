import React from "react";
import {connect} from "react-redux";
import LoggedInLayout from "./LoggedInLayout";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Container from "@material-ui/core/Container";
import {selectHistoryState, selectUserState} from "../reducers";
import {Typography} from "@material-ui/core";
import {Reach} from "./Reach";

const useStyles = makeStyles(theme => ({
  content: {
    flexGrow: 1,
    overflow: 'auto',
  },
  headerContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6, 0, 6),
    marginBottom: theme.spacing(1),
  },
}));


const Dashboard = () => {
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
            SOGoS
          </Typography>
          <Typography variant="h5" align="center" color="textSecondary" paragraph>
            Something short and leading about the collection below—its contents, the creator, etc.
            Make it short and sweet, but not too short so folks don&apos;t simply skip over it
            entirely.
          </Typography>
          <Reach/>
        </Container>
      </div>
      <main className={classes.content}>

      </main>
    </LoggedInLayout>
  );
};

const mapStateToProps = state => {
  const {information: {fullName}} = selectUserState(state);
  const {selectedHistoryRange: {from, to}} = selectHistoryState(state);
  return {
    fullName,
    selectedFrom: from,
    selectedTo: to
  }
};

export default connect(mapStateToProps)(Dashboard);
