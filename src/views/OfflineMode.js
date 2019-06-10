import {connect} from "react-redux";
import React from "react";
import Zoom from '@material-ui/core/Zoom';
import CloudOff from '@material-ui/icons/CloudOff';

const OfflineMode = ({isOnline}) => {

  return (
    <Zoom in={!isOnline}>
      <CloudOff/>
    </Zoom>
  );
};
const mapStateToProps = state => {
  const {network: {isOnline}} = state;
  return {
    isOnline,
  }
};
export default connect(mapStateToProps)(OfflineMode);
