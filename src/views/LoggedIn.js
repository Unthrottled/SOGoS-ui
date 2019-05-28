import React from "react";
import {connect} from "react-redux";
import {logout} from "../actions/SecurityActions";
import {startActivity} from "../actions/ActivityActions";
import Fab from "@material-ui/core/Fab";
import AddIcon from '@material-ui/icons/Add';
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  fab: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

class LoggedIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  startActivity(): void {
    const {dispatch: dispetch} = this.props;
    dispetch(startActivity({
      antecedenceTime: new Date().getTime()
    }));
  }

  logout(): void {
    const {dispatch: dispetch} = this.props;
    dispetch(logout());
  }

  render() {
    const {fullName} = this.props;
    const classes={}
    return (
      <div>
        <h3>What's up {fullName}?</h3>
        <Fab onClick={()=>console.log('Finna bust a nut')} color="primary" aria-label="Add" className={classes.fab}>
          <AddIcon />
        </Fab>
        <button onClick={()=>this.startActivity()}>Start Activity</button>
        There's a ninja with huge boobs over there.
        <button onClick={() => this.logout()}>Logout</button>
      </div>
    );
  }
}

LoggedIn.propTypes = {};

const mapStateToProps = state => {
  const {user: {information: {fullName}}} = state;
  return {
    fullName,
  }
};

export default connect(mapStateToProps)(LoggedIn);
