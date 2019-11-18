import * as React from 'react';
import Activity from "../../images/ActivityIcon.svg";
import ReactSVG from "react-svg";
import {findChild, SizeType} from "./MountainIcon";
import {ColorType} from "../../types/StrategyTypes";


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

  const alterColor = (svg: any, childID: any, usableColorType: any, modifier: any = (node: any, color: ColorType)=>{
    node.setAttribute('fill', color.hex);
    node.setAttribute('fill-opacity', String(color.opacity));
  }) => {
    const background = findChild(svg, (node: any) => {
      return node.id && node.id.startsWith(childID);
    });
    modifier(background, usableColorType);
  };

  return (
      <ReactSVG src={Activity} beforeInjection={(svg) => {
        svg.setAttribute('width', String(usableSize.width || defaultSize.width));
        svg.setAttribute('height', String(usableSize.height || defaultSize.height));
        alterColor(svg, 'activityLine', usableLine, (node: any, color: ColorType)=>{
          node.setAttribute('stroke', color.hex);
          node.setAttribute('stroke-opacity', String(color.opacity));
        });
        alterColor(svg, 'activityBackground', usableBackground);
      }}/>
  );
};
