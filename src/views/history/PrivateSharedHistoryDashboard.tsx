import React, {FC, useEffect} from 'react';
import {useDispatch} from "react-redux";
import {createViewedHistoryEvent} from "../../events/HistoryEvents";
import SharedHistoryDashboardComponents from "./SharedHistoryDashboardComponents";

const PrivateSharedHistoryDashboard: FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(createViewedHistoryEvent());
  }, [dispatch])
  ;

  return (
    <SharedHistoryDashboardComponents/>
  )

};

export default PrivateSharedHistoryDashboard;
