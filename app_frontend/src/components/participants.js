import {useContext} from "react";
import { GlobalStore } from "../store/globalStore";
import ChatService from "../services/chatService";
import {List, ListItem, ListItemText, ListItemIcon } from "@mui/material";
import {FaCrown, FaTrashAlt} from "react-icons/fa";


const Participants = ({participants, setParticipants, setUsers}) => {
    const [state, dispatch] = useContext(GlobalStore);
    const chatRoom = state.chat.currentRoom;

    const handleDelete = (event, id) => {
      if (window.confirm('Are you sure you want to delete this user from this room?')){
        ChatService
          .deleteUserFromRoom(id)
          .then(data => {
            const {user} = participants.find(partic => partic.id === id);
            setUsers(prevState => [...prevState, {...user, toAdd: false}]);
            setParticipants(prevState => prevState.filter(participant => participant.id !== id));
          })
          .catch(error => {
            console.error(error);
          })
      }
    }
    
    return (
        <List className='partic-list'>
                    {participants.map(participant => {
                      return <ListItem classes={{ label: 'partic-item' }}  key={participant.id}>
                                <ListItemText primary={`${participant.user.username}`} />
                                
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
                            </ListItem>
                    })}
       </List>
    )
}

export default Participants;