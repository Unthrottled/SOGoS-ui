// @flow
import * as React from 'react';
import type {SizeType} from "./MountainIcon";
import type {TacticalActivity} from "../types/TacticalModels";
import {ActivityIcon, defaultBackground, defaultLine} from "./ActivityIcon";

type TacticalActivityIconProps = {
  tacticalActivity?: TacticalActivity,
  size?: SizeType,
}
export const TacticalActivityIcon = ({tacticalActivity, size}: TacticalActivityIconProps) => {
  const iconCustomization = (tacticalActivity || {}).iconCustomization;
  const backgroundColor = (iconCustomization && iconCustomization.background) || defaultBackground;
  const lineColor = (iconCustomization && iconCustomization.line) || defaultLine;
  return (
    <div>
      <ActivityIcon backgroundColor={backgroundColor}
                    lineColor={lineColor}
                    size={size}/>
    </div>
  );
};
