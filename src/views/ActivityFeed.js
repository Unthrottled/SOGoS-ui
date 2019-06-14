import React from "react";
import {connect} from 'react-redux';

const ActivityFeed = ({activityFeed}) => {
  return (
    <div>
      {
        activityFeed.map(activity => (
          <div key={activity.content.uuid}>
            {new Date(activity.antecedenceTime).toISOString()} {activity.content.name}
          </div>
        ))
      }
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
