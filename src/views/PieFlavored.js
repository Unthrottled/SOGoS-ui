import * as React from 'react';

type Props = {};
export const PieFlavored = (props: Props) => {
  return (
    <div style={{
      height: '100%',
      width: '100%'
    }}>

    </div>
  );
};

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
