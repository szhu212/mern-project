import { combineReducers } from 'redux';
import session from './session_api_reducer';
import errors from './errors_reducer';
import ui from './ui_reducer'
import rooms from './rooms_reducer'
import users from './users_reducer'
import roles from './roles_reducer'

const RootReducer = combineReducers({
  session,
  rooms,
  users,
  roles,
  errors,
  ui,
});

export default RootReducer;