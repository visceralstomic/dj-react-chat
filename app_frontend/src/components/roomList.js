import chatService from "../services/chatService";
import { useEffect, useContext } from "react";
import {GlobalStore} from "../store/globalStore";
import {FaCrown} from "react-icons/fa";
import './roomList.css';

const RoomList = props => {
    const [state, dispatch] = useContext(GlobalStore);

    useEffect(() => {
        chatService
            .getRooms()
            .then(data => {

                dispatch({type: 'SET_ROOM_LIST', data})
            })
            .catch(error => {
                console.error(error)
            })
    }, [])
    
    return (
        <div className="room-list">
            {state.chat.rooms.map(room => {
               
                return <button
                            key={room.id} 
                            onClick={() => dispatch({type: 'SET_CHAT_ROOM', data: room})} 
                        >
                        {room.name} {room.creator.id === state.user.uid 
                                        ? <FaCrown
                                            style={{
                                                color: '#191919'
                                            }}
                                          /> : null }
                        </button>
            })}
        </div>
    ) 
}


export default RoomList;