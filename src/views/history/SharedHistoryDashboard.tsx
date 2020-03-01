import React, {FC, useEffect} from 'react';
import HistoryDashboardComponents from "./HistoryDashboardComponents";
import {connect, useDispatch} from "react-redux";
import {createViewedSharedHistoryEvent} from "../../events/HistoryEvents";
import {GlobalState, selectSecurityState} from "../../reducers";
import SharedPausedPomodoro from "../time/SharedPausedPomodoro";

interface Props {
  hasShared?: boolean
}

const SharedHistoryDashboard: FC<Props> = ({
                                             hasShared
                                           }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(createViewedSharedHistoryEvent());
  }, [dispatch])

  return hasShared === undefined || hasShared ? (
    <>
      <HistoryDashboardComponents/>
      <SharedPausedPomodoro/>
    </>
  ) : <div>
    They no share
  </div>;
};

const mapStateToProps = (state: GlobalState) => {
  const {
    readToken
  } = selectSecurityState(state);
  return {
    hasShared: !!readToken
  }
}

export default connect(mapStateToProps)(SharedHistoryDashboard);
