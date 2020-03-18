import { combineReducers } from 'redux';
import session from './session_api_reducer';
import errors from './errors_reducer';
import ui from './ui_reducer'
import rooms from './rooms_reducer'
import users from './users_reducer'

const RootReducer = combineReducers({
  session,
  ui,
  errors,
  rooms,
  users
});

export default RootReducer;