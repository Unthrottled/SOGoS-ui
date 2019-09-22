// @flow
import * as React from 'react';
import type {ColorType} from "../types/StrategyModels";
import Activity from "../images/ActivityIcon.svg";
import ReactSVG from "react-svg";


type Props = {
  backgroundColor: ColorType,
  lineColor: ColorType,
  size?: SizeType,
};

const defaultSize: SizeType = {
  height: '100px',
  width: '100px',
};

const defaultBackground: ColorType = {
  hex: "#1fdb1f",
  opacity: 1
};

const defaultLine: ColorType = {
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

  function alterColor(svg, childID, usableColorType) {
    const background = findChild(svg, (node) => {
      return node.id && node.id.indexOf(childID) > -1;
    });
    background.setAttribute('fill', usableColorType.hex);
    background.setAttribute('fill-opacity', usableColorType.opacity);
  }

  return (
    <div>
      <ReactSVG src={Activity} beforeInjection={(svg) => {
        svg.setAttribute('width', usableSize.width || defaultSize.width);
        svg.setAttribute('height', usableSize.height || defaultSize.height);
        const usableColor = 'activity_line';
        alterColor(svg, usableColor, usableLine);
        alterColor(svg, "activity_background", usableBackground);
      }}/>
    </div>
  );
};
