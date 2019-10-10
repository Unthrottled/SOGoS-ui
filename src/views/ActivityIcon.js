// @flow
import * as React from 'react';
import type {ColorType} from "../types/StrategyModels";
import Activity from "../images/ActivityIcon.svg";
import ReactSVG from "react-svg";
import {findChild} from "./MountainIcon";


type Props = {
  backgroundColor?: ColorType,
  lineColor?: ColorType,
  size?: SizeType,
};

const defaultSize: SizeType = {
  height: '100px',
  width: '100px',
};

export const defaultBackground: ColorType = {
  hex: "#1fdb1f",
  opacity: 1
};

export const defaultLine: ColorType = {
  hex: "#44932d",
  opacity: 1
};


export const ActivityIcon = (props: Props) => {
  const {backgroundColor, lineColor, size} = props;
  const usableBackground: ColorType = {
    ...defaultBackground,
    ...(backgroundColor || {})
  };
  const usableLine: ColorType = {
    ...defaultLine,
    ...(lineColor || {})
  };

  const usableSize = size || defaultSize;

  function alterColor(svg, childID, usableColorType, modifier = (node, color)=>{
    node.setAttribute('fill', color.hex);
    node.setAttribute('fill-opacity', color.opacity);
  }) {
    const background = findChild(svg, (node) => {
      return node.id && node.id.startsWith(childID);
    });
    modifier(background, usableColorType);
  }

  return (
      <ReactSVG {...{
        ...(props.styles ? props.styles : {}),
      }} src={Activity} beforeInjection={(svg) => {
        svg.setAttribute('width', usableSize.width || defaultSize.width);
        svg.setAttribute('height', usableSize.height || defaultSize.height);
        alterColor(svg, 'activityLine', usableLine, (node, color)=>{
          node.setAttribute('stroke', color.hex);
          node.setAttribute('stroke-opacity', color.opacity);
        });
        alterColor(svg, 'activityBackground', usableBackground);
      }}/>
  );
};
