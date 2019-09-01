import React, {useEffect, useState} from "react";
import {connect} from 'react-redux';
import {viewedActivityFeed} from "../actions/HistoryActions";
import { ResponsiveHeatMap } from '@nivo/heatmap'

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
      <ResponsiveHeatMap
        data={data}
        keys={[
          'hot dog',
          'burger',
          'sandwich',
          'kebab',
          'fries',
          'junk',
          'sushi',
        ]}
        indexBy="country"
        margin={{ top: 100, right: 60, bottom: 60, left: 60 }}
        forceSquare={true}
        axisTop={{ orient: 'top', tickSize: 5, tickPadding: 5, tickRotation: -90, legend: '', legendOffset: 36 }}
        axisRight={null}
        axisBottom={null}
        axisLeft={{
          orient: 'left',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'country',
          legendPosition: 'middle',
          legendOffset: -40
        }}
        cellOpacity={1}
        cellBorderColor={{ from: 'color', modifiers: [ [ 'darker', 0.4 ] ] }}
        labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.8 ] ] }}
        defs={[
          {
            id: 'lines',
            type: 'patternLines',
            background: 'inherit',
            color: 'rgba(0, 0, 0, 0.1)',
            rotation: -45,
            lineWidth: 4,
            spacing: 7
          }
        ]}
        fill={[ { id: 'lines' } ]}
        animate={true}
        motionStiffness={80}
        motionDamping={9}
        hoverTarget="cell"
        cellHoverOthersOpacity={0.25}
      />
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
},  {
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
},]

//   .map(d=> {
//   d.date = new Date(d.day).getTime()
//   return d
// }).sort(((a, b) => a - b))
//   .filter((v, i) => i < 10);