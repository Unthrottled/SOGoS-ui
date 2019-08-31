// @flow
import * as React from 'react';
import type {ColorType} from "../types/StrategyModels";
import Goal from "../images/Goal.svg";
import ReactSVG from "react-svg";
import {objectToArray} from "../miscellanous/Tools";

const findChild = (node, finder) => {
  const queue = [];
  queue.push(node);
  while (queue.length > 0) {
    const currentNode = queue.pop();
    if (finder(currentNode)) {
      return currentNode;
    } else {
      currentNode._checked = 1;
      objectToArray(currentNode.childNodes).filter(n => !n._checked)
        .forEach(n => queue.unshift(n));
    }
  }
  return undefined;
};


type Props = {
  skyColor: ColorType
};
export const MountainIcon = (props: Props) => {
  const {skyColor} = props;
  return (
    <div>
      <ReactSVG src={Goal} beforeInjection={(svg) => {
        svg.setAttribute('width', '100px');
        svg.setAttribute('height', '100px');
        const background = findChild(svg, (node) => {
          return node.id && node.id.indexOf('path5680') > -1;
        });
        background.setAttribute('fill', skyColor.hex);
        background.setAttribute('fill-opacity', skyColor.opacity);
      }}/>
    </div>
  );
};