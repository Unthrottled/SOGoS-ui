import React from 'react';
import Typography from '@material-ui/core/Typography';
import {connect} from 'react-redux';
import {GlobalState} from '../../reducers';

const WeeklyHeatMap = () => {
  return (
    <div>
      <Typography variant={'h2'}>Weekly Heatmap</Typography>
    </div>
  );
};

const mapStateToProps = (globalState: GlobalState) => {
  return {};
};

export default connect(mapStateToProps)(WeeklyHeatMap);
