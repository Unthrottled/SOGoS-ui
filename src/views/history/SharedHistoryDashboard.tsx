import React, {useEffect} from 'react';
import HistoryDashboardComponents from "./HistoryDashboardComponents";
import {useDispatch} from "react-redux";
import {createViewedSharedHistoryEvent} from "../../events/HistoryEvents";

const SharedHistoryDashboard = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(createViewedSharedHistoryEvent());
  }, [dispatch])

  return (
    <HistoryDashboardComponents/>
  );
};

export default SharedHistoryDashboard;
