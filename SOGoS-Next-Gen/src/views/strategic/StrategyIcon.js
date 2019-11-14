// @flow
import * as React from 'react';
import type {ColorType} from "../types/StrategyModels";
import Strategy from "../../images/StrategyIcon.svg";
import ReactSVG from "react-svg";

type Props = {
  backgroundColor?: ColorType,
  lineColor?: ColorType,
  size?: SizeType,
};

const defaultSize: SizeType = {
  height: '100px',
  width: '100px',
};


export const StrategyIcon = (props: Props) => {
  const {size} = props;

  const usableSize = size || defaultSize;



  return (
    <div>
      <ReactSVG src={Strategy} beforeInjection={(svg) => {
        svg.setAttribute('width', usableSize.width || defaultSize.width);
        svg.setAttribute('height', usableSize.height || defaultSize.height);
      }}/>
    </div>
  );
};
