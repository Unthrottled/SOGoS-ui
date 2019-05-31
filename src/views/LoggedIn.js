import React from "react";
import {connect} from "react-redux";
import {logout} from "../actions/SecurityActions";
import Activity from "./Activity";

class LoggedIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  logout(): void {
    const {dispatch: dispetch} = this.props;
    dispetch(logout());
  }

  render() {
    const {fullName} = this.props;
    return (
      <div>
        <Activity/>
        <h3>What's up {fullName}?</h3>
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
