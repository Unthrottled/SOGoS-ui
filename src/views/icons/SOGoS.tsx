import * as React from 'react';
import SOGoSIcon from '../../images/SOGoS.svg';
import ReactSVG from 'react-svg';
import {ColorType} from '../../types/StrategyTypes';
import {SizeType} from './MountainIcon';

type Props = {
  backgroundColor?: ColorType;
  lineColor?: ColorType;
  size?: SizeType;
  styles?: any
};

const defaultSize: SizeType = {
  height: '150px',
  width: '150px',
};

export const SOGoS = (props: Props) => {
  const {size, styles} = props;
  const usableSize = size || defaultSize;
  return (
    <div style={styles}>
      <ReactSVG
        src={SOGoSIcon}
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
