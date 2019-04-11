import {combineReducers} from "redux";
import userReducer from './UserReducer';
import securityReducer from './SecurityReducer';

const rootReducer = combineReducers({
  security: securityReducer,
  user: userReducer
});

export default rootReducer;
