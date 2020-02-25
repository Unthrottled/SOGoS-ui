import * as React from 'react';
import Strategy from '../../images/StrategyIcon.svg';
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

export const StrategyIcon = (props: Props) => {
  const {size} = props;
  const usableSize = size || defaultSize;
  return (
    <div>
      <ReactSVG
        src={Strategy}
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
    </div>
  );
};
