import * as React from 'react';
import {ActivityIcon, defaultBackground, defaultLine} from './ActivityIcon';
import {TacticalActivity} from '../../types/TacticalTypes';
import {SizeType} from './MountainIcon';

type TacticalActivityIconProps = {
  tacticalActivity?: TacticalActivity;
  size?: SizeType;
};
export const TacticalActivityIcon = ({
  tacticalActivity,
  size,
}: TacticalActivityIconProps) => {
  const iconCustomization = (tacticalActivity || {}).iconCustomization;
  const backgroundColor =
    (iconCustomization && iconCustomization.background) || defaultBackground;
  const lineColor =
    (iconCustomization && iconCustomization.line) || defaultLine;
  return (
    <div>
      <ActivityIcon
        backgroundColor={backgroundColor}
        lineColor={lineColor}
        size={size}
      />
    </div>
  );
};
