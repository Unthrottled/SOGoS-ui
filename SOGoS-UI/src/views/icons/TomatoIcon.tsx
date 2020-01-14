import * as React from 'react';
import Tomato from '../../images/Tomato.svg';
import ReactSVG from 'react-svg';
import {ColorType} from '../../types/StrategyTypes';
import {SizeType} from './MountainIcon';

type Props = {
  backgroundColor?: ColorType;
  lineColor?: ColorType;
  size?: SizeType;
};

const defaultSize: SizeType = {
  height: '100px',
  width: '100px',
};

export const TomatoIcon = (props: Props) => {
  const {size} = props;
  const usableSize = size || defaultSize;
  return (
    <ReactSVG
      src={Tomato}
      beforeInjection={svg => {
        svg.setAttribute(
          'width',
          String(usableSize.width || defaultSize.width),
        );
        svg.setAttribute(
          'height',
          String(usableSize.height || defaultSize.height),
        );
      }}
    />
  );
};
