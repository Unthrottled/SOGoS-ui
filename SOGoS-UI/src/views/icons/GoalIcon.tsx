import * as React from 'react';
import {MountainIcon, SizeType} from './MountainIcon';
import {Objective} from '../../types/StrategyTypes';

type GoalProps = {
  objective?: Objective | null;
  size?: SizeType;
};
export const GoalIcon = ({objective, size}: GoalProps) => {
  const iconCustomization = (objective || {}).iconCustomization;
  const skyColor = (iconCustomization && iconCustomization.background) || {
    hex: '#86a4f3',
    opacity: 1,
  };
  return (
    <div>
      <MountainIcon skyColor={skyColor} size={size} />
    </div>
  );
};
