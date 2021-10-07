
import axios_instance from "./globalAxios";


const createChat = data => {
    return axios_instance
            .post("/chat/room/", data)
            .then(response => response.data);
}

const getRooms = () => {
    return axios_instance
            .get("/chat/room/")
            .then(response => response.data);
}


const addUserToRoom = data => {
    return axios_instance
            .post("/chat/participant/", data)
            .then(response => response.data)
}

const getRoomParticipants = roomId => {
    return axios_instance
            .get(`/chat/participant/?room_id=${roomId}`)
            .then(response => response.data) 
}

const deleteRoom = room_id => {
    return axios_instance
            .delete(`/chat/room/${room_id}`)
            .then(response => response.data)
}

const deleteUserFromRoom = data => {
    console.log('delete', typeof data)
    return axios_instance
            .delete(`/chat/participant/${data}`)
            .then(response => response.data)
}

export default {
    createChat,
    getRooms,
    addUserToRoom,
    getRoomParticipants,
    deleteRoom,
    deleteUserFromRoom
}