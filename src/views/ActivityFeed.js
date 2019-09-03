import React, {useEffect, useState} from "react";
import {connect} from 'react-redux';
import {viewedActivityFeed} from "../actions/HistoryActions";


const ActivityFeed = ({dispatch}) => {
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


const data = [{
  "country": "AD",
  "hot dog": 20,
  "hot dogColor": "hsl(72, 70%, 50%)",
  "burger": 22,
  "burgerColor": "hsl(132, 70%, 50%)",
  "sandwich": 95,
  "sandwichColor": "hsl(24, 70%, 50%)",
  "kebab": 60,
  "kebabColor": "hsl(112, 70%, 50%)",
  "fries": 36,
  "friesColor": "hsl(47, 70%, 50%)",
  "donut": 54,
  "donutColor": "hsl(353, 70%, 50%)",
  "junk": 70,
  "junkColor": "hsl(12, 70%, 50%)",
  "sushi": 20,
}, {
  "country": "aoeu",
  "hot dog": 20,
  "hot dogColor": "hsl(72, 70%, 50%)",
  "burger": 22,
  "burgerColor": "hsl(132, 70%, 50%)",
  "sandwich": 95,
  "sandwichColor": "hsl(24, 70%, 50%)",
  "kebab": 60,
  "kebabColor": "hsl(112, 70%, 50%)",
  "fries": 36,
  "friesColor": "hsl(47, 70%, 50%)",
  "donut": 54,
  "donutColor": "hsl(353, 70%, 50%)",
  "junk": 70,
  "junkColor": "hsl(12, 70%, 50%)",
  "sushi": 20,
},];

//   .map(d=> {
//   d.date = new Date(d.day).getTime()
//   return d
// }).sort(((a, b) => a - b))
//   .filter((v, i) => i < 10);


