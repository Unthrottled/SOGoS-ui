import React, {useEffect, useState} from "react";
import {connect} from 'react-redux';
import {viewedActivityFeed} from "../actions/HistoryActions";

const ActivityFeed = ({activityFeed, dispatch}) => {
  const [didMountState] = useState('');
  useEffect(() => {
    dispatch(viewedActivityFeed());
  }, [didMountState]);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      minHeight: '500px',
    }}>
      {/*{*/}
      {/*  activityFeed.map(activity => (*/}
      {/*    <div key={activity.content.uuid}>*/}
      {/*      {new Date(activity.antecedenceTime).toISOString()} {activity.content.name}*/}
      {/*    </div>*/}
      {/*  ))*/}
      {/*}*/}
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


const data = [  {
  "day": "2015-05-07",
  "value": 177
}].map(d=> {
  d.date = new Date(d.day).getTime()
  return d
}).sort(((a, b) => a - b))
  .filter((v, i) => i < 10);