import {createViewedHistoryEvent} from "../events/HistoryEvents";


export const
  viewedActivityFeed = () =>
    dispetch => {
      dispetch(createViewedHistoryEvent());
    };
