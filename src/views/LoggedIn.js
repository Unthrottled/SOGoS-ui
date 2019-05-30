import React from "react";
import {connect} from "react-redux";
import {logout} from "../actions/SecurityActions";
import {startActivity} from "../actions/ActivityActions";
import {withStyles} from "@material-ui/core/styles";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import Timer from '@material-ui/icons/AvTimer';
import uuid from 'uuid/v4';



class LoggedIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  actions = [
    {icon: <Timer/>, name: 'Start Task', perform: ()=>this.startActivity()},
  ];

  startActivity(): void {
    const {dispatch: dispetch} = this.props;
    dispetch(startActivity({
      antecedenceTime: new Date().getTime(),
      content: {
        id: uuid()
      }
    }));
  }

  logout(): void {
    const {dispatch: dispetch} = this.props;
    dispetch(logout());
  }

  handleClick = () => {
    this.setState(state => ({
      open: !state.open,
    }));
  };

  handleClose = () => {
    this.setState({open: false});
  };

  render() {
    const {fullName, classes} = this.props;
    const {open} = this.state;
    const {actions} = this;

    return (
      <div>
        <h3>What's up {fullName}?</h3>
        <SpeedDial
          ariaLabel="SpeedDial example"
          className={classes.speedDial}
          hidden={false}
          icon={<SpeedDialIcon/>}
          onClick={this.handleClick}
          onClose={this.handleClose}
          open={open}
          direction={"right"}
        >
          {actions.map(action => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={()=>{
                this.handleClick();
                action.perform();
              }}
              title={""}
              children={<div/>}/>
          ))}
        </SpeedDial>
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

const styles = theme => ({
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  speedDial: {
    position: 'absolute',
    top: theme.spacing(1),
    left: theme.spacing(1),
    margin: theme.spacing(1),
  },
});
export default connect(mapStateToProps)(withStyles(styles)(LoggedIn));
