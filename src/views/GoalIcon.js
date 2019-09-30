// @flow
import * as React from 'react';
import type {Objective} from "../types/StrategyModels";
import type {SizeType} from "./MountainIcon";
import {MountainIcon} from "./MountainIcon";

type GoalProps = {
  objective: Objective,
  size?: SizeType,
}
export const GoalIcon = ({objective, size}: GoalProps) => {
  const iconCustomization = objective.iconCustomization;
  const skyColor = (iconCustomization && iconCustomization.background) || {
    hex: '#86a4f3',
    opacity: 1,
  };
  return (
    <div>
      <MountainIcon skyColor={skyColor} size={size}/>
    </div>
  );
};
