import {useContext} from "react";
import { Button, ListGroup, ListGroupItem , Label, Input} from 'reactstrap';
import chatService from "../services/chatService";
import {GlobalStore} from "../store/globalStore";


const AddUsers = ({users, setUsers,setParticipants }) => {
    const [state, dispatch] = useContext(GlobalStore);
    const chatRoom = state.chat.currentRoom;


    const handleCheck = event => {
        const { checked, value } = event.target;
        setUsers(users.map(user => user.id === parseInt(value) ? {...user, toAdd: checked} : user));
    }

    const AddUsersToRoom = event => {
        if (window.confirm('Are you sure you want to add this user(s) to the room ?')) {
            const promises = [];
            for (let i in users) {
                if (users[i].toAdd) {
                    promises.push(chatService.addUserToRoom({user: users[i].id, room: chatRoom.id}))
                }
            }
            Promise.all(promises).then(data => {
                data.forEach(partic => {
                    const userPartic = users.find(user => user.id === partic.user);
                    delete userPartic.toAdd;
                    const newParticipant = {id: partic.id, user: userPartic, room: partic.room };
                    setUsers(prevState => prevState.filter(user => user.id !== partic.user));
                    setParticipants(prevState => [...prevState, newParticipant]);
                })
            })
        }
        
    }

    return (
        <>
            <ListGroup  className='partic-list'>
                        {users.length > 0 ? 
                        ( users.map(user => {
                            return (
                                <ListGroupItem
                                    className='partic-item' 
                                    key={user.id}
                                >
                                    <Label check>
                                        <Input 
                                            value={user.id}
                                            type="checkbox" 
                                            checked={users.toAdd}
                                            onChange={handleCheck}
                                        />
                                        {user.username}
                                    </Label>
                                </ListGroupItem>
                            )
                        }) ) : (
                            <div>
                                There are no users to add
                            </div>
                        )}
            </ListGroup>
                    <Button 
                        onClick={AddUsersToRoom} 
                        disabled={users.length === 0 && true}
                    >
                        Add users to room
                    </Button>
        </>
    )
}

export default AddUsers;