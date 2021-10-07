
const chatReducer = (state, action) => {
    switch(action.type) {
        case "SET_CHAT_ROOM":
            return {
                ...state,
                chat: {
                    ...state.chat,
                    currentRoom: action.data
                }
            }
        case 'ADD_CHAT_ROOM':
            return {
                ...state,
                chat: {
                    ...state.chat,
                    rooms: [...state.chat.rooms, action.data]
                }
            }
        case "SET_ROOM_LIST":
            return  {
                ...state,
                chat: {
                    ...state.chat,
                    rooms: action.data
                }
            }
        case "DELETE_ROOM":
            const rooms = state.chat.rooms.filter(room => room.id !== action.data.id )
            return {
                ...state,
                chat: {
                    currentRoom: null,
                    rooms: rooms,
                    participants: []

                }
            }
        case "SET_PARTICIPANTS":
            return {
                ...state,
                chat: {
                    ...state.chat,
                    participants: action.data
                }
            }
        case 'ADD_PARTICIPANT':
            return {
                ...state,
                chat: {
                    ...state.chat,
                    participants: [...state.chat.participants, action.data]
                }
            }

        case 'DELETE_PARTICIPANT':
            const newParticipants = state.chat.participants.filter(user => user.id !== action.data.id)
            return {
                ...state,
                chat: {
                    ...state.chat,
                    participants: newParticipants
                }
            }
        case "SET_NO_ROOM":
            return {
                    ...state,
                    chat: {
                        ...state.chat,
                        currentRoom: null,    
                    }
                }

        default: return state 
    }
}

export default chatReducer;