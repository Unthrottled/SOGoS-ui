import React from "react";
import {connect} from 'react-redux';

const ActivityFeed = () => {
  return (
    <div>
      <ul>
        <li>Most Recent Thing You did</li>
        <li>Second Most Recent Thing You did</li>
        <li>Recent Thing You did a while ago</li>
      </ul>
    </div>
  );
};

export default connect()(ActivityFeed);
