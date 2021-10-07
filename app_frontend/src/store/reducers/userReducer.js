

const userReducer = (state, action) => {
    switch (action.type) {
        case "SET_USER":
            return {
                ...state,
                user: {
                        uid: action.data.id,
                        username: action.data.username,
                        photo: action.data.photo  
                },
                loading: false
            }
        case "LOGOUT":
            return {
                chat: {
                    currentRoom: null,
                    rooms: [],
                    participants: []
                },
                user: {
                        uid: '',
                        username: '',
                        photo: ''
                },
                loading: true
            }
        default: return state
    }
}

export default userReducer;