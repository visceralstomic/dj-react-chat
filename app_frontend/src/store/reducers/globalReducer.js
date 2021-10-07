import userReducer from "./userReducer";
import chatReducer from "./chatReducer";


const initState = {
    user: {uid: '', username: '', photo: null},
    chat: {
        currentRoom: null,
        rooms: [],
        participants: []
    },
    loading: true
}

const combineReducers = reducers => {
    return (state, action) => {
      return Object.keys(reducers).reduce(
        (acc, prop) => {
          return ({
            ...acc,
            ...reducers[prop]({ [prop]: acc[prop] }, action),
          })
        },
        state
      )
    }
  }

const reducer = combineReducers({
    chat: chatReducer,
    user: userReducer
})

export {initState, reducer};