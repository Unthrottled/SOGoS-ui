import React, {useEffect} from 'react';
import { useParams } from 'react-router-dom';
import {LoadingIndicator} from "../history/HistoryDashboardComponents";
import {useDispatch} from "react-redux";
import {createLandedOnSharedBridgeEvent} from "../../events/UserEvents";

const ShareLandingComponent = () => {
  const {shareId} = useParams<{shareId: string}>();
  const dispetch = useDispatch();
  useEffect(()=>{
    dispetch(createLandedOnSharedBridgeEvent(shareId));
  },[]);
  return (
    <div>
      <LoadingIndicator/>
    </div>
  );
};

export default ShareLandingComponent;
