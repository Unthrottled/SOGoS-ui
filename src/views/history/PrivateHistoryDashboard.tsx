import React from 'react';
import LoggedInLayout from '../components/LoggedInLayout';
import HistoryDashboardComponents from "./HistoryDashboardComponents";

const PrivateHistoryDashboard = () => {

  return (
    <LoggedInLayout>
      <HistoryDashboardComponents/>
    </LoggedInLayout>
  );
};

export default PrivateHistoryDashboard;
