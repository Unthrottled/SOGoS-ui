import React from "react";
import {connect} from "react-redux";
import {logout} from "../actions/SecurityActions";
import {startActivity} from "../actions/ActivityActions";
import {withStyles} from "@material-ui/core/styles";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import FileCopyIcon from '@material-ui/icons/FileCopyOutlined';
import SaveIcon from '@material-ui/icons/Save';
import PrintIcon from '@material-ui/icons/Print';
import ShareIcon from '@material-ui/icons/Share';
import DeleteIcon from '@material-ui/icons/Delete';


const actions = [
  {icon: <FileCopyIcon/>, name: 'Copy'},
  {icon: <SaveIcon/>, name: 'Save'},
  {icon: <PrintIcon/>, name: 'Print'},
  {icon: <ShareIcon/>, name: 'Share'},
  {icon: <DeleteIcon/>, name: 'Delete'},
];

class LoggedIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
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

  handleClick = () => {
    this.setState(state => ({
      open: !state.open,
    }));
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleOpen = () => {
    this.setState({open: true});
  };

  render() {
    const {fullName, classes} = this.props;
    const {open} = this.state;

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
        >
          {actions.map(action => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={this.handleClick}
              title={""}
              children={<div/>}/>
          ))}
        </SpeedDial>
        <button onClick={() => this.startActivity()}>Start Activity</button>
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
