import React from "react";
import {connect} from "react-redux";
import {login} from "../actions/SecurityActions";

class LoggedOut extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  login(): void {
    const {dispatch: dispetch} = this.props;
    dispetch(login());
  }

  render() {
    return (
      <div>
        <h3>Hey it looks like you need to login!</h3>
        <button onClick={() => this.login()}>Login</button>
      </div>
    );
  }
}

LoggedOut.propTypes = {};

const mapStateToProps = state => {
  return {}
};

export default connect(mapStateToProps)(LoggedOut);
