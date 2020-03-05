import React, {FC, useEffect} from 'react';
import {useDispatch} from "react-redux";
import {createViewedSharedHistoryEvent} from "../../events/HistoryEvents";
import SharedHistoryDashboardComponents from "./SharedHistoryDashboardComponents";

const SharedHistoryDashboard: FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(createViewedSharedHistoryEvent());
  }, [dispatch]);

  return (
    <SharedHistoryDashboardComponents/>
  )
};

export default SharedHistoryDashboard;
