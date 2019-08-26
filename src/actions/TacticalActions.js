import {createViewedSettingsEvent} from "../events/TacticalEvents";


export const
  viewedSettings = () =>
    dispetch => {
      dispetch(createViewedSettingsEvent());
    };
