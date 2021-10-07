import {useContext} from "react";
import { GlobalStore } from "../store/globalStore";
import ChatService from "../services/chatService";
import { ListGroup, ListGroupItem } from 'reactstrap';
import {FaCrown, FaTrashAlt} from "react-icons/fa";

const Participants = () => {
    const [state, dispatch] = useContext(GlobalStore);
    const chatRoom = state.chat.currentRoom;
    const {participants} = state.chat;

    const handleDelete = (event, id) => {
      if (window.confirm('Are you sure you want to delete this user from this room?')){
        ChatService
        .deleteUserFromRoom(id)
        .then(data => {
          dispatch({type: 'DELETE_PARTICIPANT', data: {id: id}})
        })
        .catch(error => {
          console.error(error);
        })
      }
    }
    
    return (
        <ListGroup className='partic-list'>
                    {participants.map(participant => {
                      return <ListGroupItem className='partic-item' key={participant.id}>
                                {participant.user.username}
                                {participant.user.id === chatRoom.creator.id ? (
                                    <FaCrown
                                          style={{
                                              color: 'hsl(353, 59%, 43%)'
                                          }}
                                    />
                                ) : (
                                  state.user.uid === chatRoom.creator.id ? (
                                      <FaTrashAlt
                                        onClick={(event) => handleDelete(event, participant.id)}
                                        style={{
                                          color: 'hsl(350, 99%, 50%)',
                                          cursor: 'pointer'
                                        }}
                                      />
                                  ) : (
                                    null
                                  )
                                )} 
                            </ListGroupItem>
                    })}
       </ListGroup>
    )
}

export default Participants;