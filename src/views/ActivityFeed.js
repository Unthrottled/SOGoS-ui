import React from "react";
import {connect} from 'react-redux';

const ActivityFeed = ({activityFeed}) => {
  return (
    <div>
      <ul>
        <li>Most Recent Thing You did</li>
        <li>Second Most Recent Thing You did</li>
        <li>Recent Thing You did a while ago</li>
        {
          activityFeed.map(activity => (
            <div>
              {activity.antecedenceTime} {activity.name}
            </div>
          ))
        }
      </ul>
    </div>
  );
};
const mapStateToProps = state => {
  const {history: {activityFeed}} = state;
  return {
    activityFeed
  }
};
export default connect(mapStateToProps)(ActivityFeed);
