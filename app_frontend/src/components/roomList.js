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
                const style = {
                    borderLeft: room.creator.id === state.user.uid ? '15px solid hsl(353, 59%, 43%)' : ''
                } 
                return <button
                            style={style} 
                            key={room.id} 
                            onClick={() => dispatch({type: 'SET_CHAT_ROOM', data: room})} 
                        >
                        {room.name} {room.creator.id === state.user.uid 
                                        ? <FaCrown
                                            style={{
                                                color: 'hsl(353, 59%, 43%)'
                                            }}
                                          /> : null }
                        </button>
            })}
        </div>
    ) 
}


export default RoomList;