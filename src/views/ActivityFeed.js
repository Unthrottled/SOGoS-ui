import React, {useEffect, useState} from "react";
import {connect} from 'react-redux';
import {viewedActivityFeed} from "../actions/HistoryActions";
import { ResponsiveHeatMap } from '@nivo/heatmap'
import { ResponsivePie } from '@nivo/pie'


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
      <ResponsivePie
        data={pieData}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        colors={{ scheme: 'nivo' }}
        borderWidth={1}
        borderColor={{ from: 'color', modifiers: [ [ 'darker', 0.2 ] ] }}
        radialLabelsSkipAngle={10}
        radialLabelsTextXOffset={6}
        radialLabelsTextColor="#333333"
        radialLabelsLinkOffset={0}
        radialLabelsLinkDiagonalLength={16}
        radialLabelsLinkHorizontalLength={24}
        radialLabelsLinkStrokeWidth={1}
        radialLabelsLinkColor={{ from: 'color' }}
        slicesLabelsSkipAngle={10}
        slicesLabelsTextColor="#333333"
        animate={true}
        motionStiffness={90}
        motionDamping={15}
        defs={[
          {
            id: 'dots',
            type: 'patternDots',
            background: 'inherit',
            color: 'rgba(255, 255, 255, 0.3)',
            size: 4,
            padding: 1,
            stagger: true
          },
          {
            id: 'lines',
            type: 'patternLines',
            background: 'inherit',
            color: 'rgba(255, 255, 255, 0.3)',
            rotation: -45,
            lineWidth: 6,
            spacing: 10
          }
        ]}
        fill={[
          {
            match: {
              id: 'ruby'
            },
            id: 'dots'
          },
          {
            match: {
              id: 'c'
            },
            id: 'dots'
          },
          {
            match: {
              id: 'go'
            },
            id: 'dots'
          },
          {
            match: {
              id: 'python'
            },
            id: 'dots'
          },
          {
            match: {
              id: 'scala'
            },
            id: 'lines'
          },
          {
            match: {
              id: 'lisp'
            },
            id: 'lines'
          },
          {
            match: {
              id: 'elixir'
            },
            id: 'lines'
          },
          {
            match: {
              id: 'javascript'
            },
            id: 'lines'
          }
        ]}
        legends={[
          {
            anchor: 'bottom',
            direction: 'row',
            translateY: 56,
            itemWidth: 100,
            itemHeight: 18,
            itemTextColor: '#999',
            symbolSize: 18,
            symbolShape: 'circle',
            effects: [
              {
                on: 'hover',
                style: {
                  itemTextColor: '#000'
                }
              }
            ]
          }
        ]}
      />
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


const pieData = [
  {
    "id": "c",
    "label": "c",
    "value": 412,
    "color": "hsl(30, 70%, 50%)"
  },
  {
    "id": "python",
    "label": "python",
    "value": 260,
    "color": "hsl(148, 70%, 50%)"
  },
  {
    "id": "make",
    "label": "make",
    "value": 324,
    "color": "hsl(353, 70%, 50%)"
  },
  {
    "id": "css",
    "label": "css",
    "value": 489,
    "color": "hsl(135, 70%, 50%)"
  },
  {
    "id": "go",
    "label": "go",
    "value": 496,
    "color": "hsl(299, 70%, 50%)"
  }
];
