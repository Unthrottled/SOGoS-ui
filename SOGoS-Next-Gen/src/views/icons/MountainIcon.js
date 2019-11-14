// @flow
import * as React from 'react';
import type {ColorType} from "../types/StrategyModels";
import Goal from "../../images/Goal.svg";
import ReactSVG from "react-svg";
import {objectToArray} from "../../miscellanous/Tools";

export const findChild = (node, finder) => {
  const queue = [];
  const touched = [];
  queue.push(node);
  while (queue.length > 0) {
    const currentNode = queue.pop();
    touched.push(currentNode);
    if (finder(currentNode)) {
      touched.forEach(n => n._checked = 0);
      return currentNode;
    } else {
      currentNode._checked = 1;
      objectToArray(currentNode.childNodes)
        .filter(n => !n._checked)
        .forEach(n => queue.unshift(n));
    }
  }
  touched.forEach(n => n._checked = 0);
  return undefined;
};


export type SizeType = {
  width?: string,
  height?: string,
}

type Props = {
  skyColor: ColorType,
  size?: SizeType,
};

const defaultSize: SizeType = {
  height: '100px',
  width: '100px',
};
export const MountainIcon = (props: Props) => {
  const {skyColor, size} = props;
  const usableSize = size || defaultSize;
  return (
    <div>
      <ReactSVG src={Goal} beforeInjection={(svg) => {
        svg.setAttribute('width', usableSize.width || defaultSize.width);
        svg.setAttribute('height', usableSize.height || defaultSize.height);
        const background = findChild(svg, (node) => {
          return node.id && node.id.indexOf('path5680') > -1;
        });
        background.setAttribute('fill', skyColor.hex);
        background.setAttribute('fill-opacity', skyColor.opacity);
      }}/>
    </div>
  );
};
