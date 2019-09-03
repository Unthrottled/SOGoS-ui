import * as React from 'react';
import {useEffect, useState} from 'react';
import {select} from 'd3-selection';
import {pie, scaleOrdinal, quantize, interpolateSpectral, arc} from 'd3'

type Props = {};
export const PieFlavored = (props: Props) => {
  const [didMountState] = useState('');
  useEffect(() => {
    const selection = select('#pieBoi');
    const  width = 100;
    const  height = 100;

    const pieSVG = selection.append('svg')
      .attr("viewBox", [-width / 2, -height / 2, width, height]);
    const pieFlavored = pie()
      .padAngle(0.005)
      .sort(null)
      .value(d => d.value);

    const arcs = pieFlavored(pieData);
    const color = scaleOrdinal()
      .domain(pieData.map(d => d.value))
      .range(quantize(t => interpolateSpectral(t * 0.8 + 0.1), pieData.length).reverse());
    const radius = Math.min(width, height) / 2;
    const arcThing = arc().innerRadius(radius * 0.67).outerRadius(radius - 1);

    pieSVG.selectAll("path")
      .data(arcs)
      .join("path")
      .attr("fill", d => color(d.data.name))
      .attr("d", arcThing)
      .append("title")
      .text(d => `${d.data.name}: ${d.data.value.toLocaleString()}`);

    pieSVG.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 12)
      .attr("text-anchor", "middle")
      .selectAll("text")
      .data(arcs)
      .join("text")
      .attr("transform", d => `translate(${arcThing.centroid(d)})`)
      .call(text => text.append("tspan")
        .attr("y", "-0.4em")
        .attr("font-weight", "bold")
        .text(d => d.data.name))
      .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
        .attr("x", 0)
        .attr("y", "0.7em")
        .attr("fill-opacity", 0.7)
        .text(d => d.data.value.toLocaleString()));

    console.log(selection);
  }, [didMountState]);

  return (
    <div style={{

    }} id={'pieBoi'}>

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
