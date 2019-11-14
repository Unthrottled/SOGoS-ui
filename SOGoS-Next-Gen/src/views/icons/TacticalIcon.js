// @flow
import * as React from 'react';
import type {ColorType} from "../types/StrategyModels";
import Tactical from "../../images/TacticalIcon.svg";
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


export const TacticalIcon = (props: Props) => {
  const {size} = props;

  const usableSize = size || defaultSize;



  return (
    <div>
      <ReactSVG src={Tactical} beforeInjection={(svg) => {
        svg.setAttribute('width', usableSize.width || defaultSize.width);
        svg.setAttribute('height', usableSize.height || defaultSize.height);
      }}/>
    </div>
  );
};
