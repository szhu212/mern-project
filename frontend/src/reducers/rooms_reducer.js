import { RECEIVE_ROOM, RECEIVE_NEW_ROOM,RECEIVE_ROOMS, EXIT_ROOM } from '../actions/room_actions';
  
  const RoomsReducer = (state = { all: {}, user: {}, new: undefined }, action) => {
    Object.freeze(state);
    let newState = Object.assign({}, state);
    switch(action.type) {
      case RECEIVE_ROOMS:
        newState.all = action.rooms.data;
        return newState;

      case RECEIVE_NEW_ROOM:
        newState.new = action.room.data
        return newState;
      case RECEIVE_ROOM:
        
        newState.user = action.room.data
        return newState

      case EXIT_ROOM:
        newState.user = undefined
        return newState
      default:
        return state;
    }
  };
  
  export default RoomsReducer;