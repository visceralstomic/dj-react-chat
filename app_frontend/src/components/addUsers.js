import {useState, useEffect, useContext} from "react";
import { Button, ListGroup, ListGroupItem , Label, Input} from 'reactstrap';
import UserService from "../services/userService";
import chatService from "../services/chatService";
import {GlobalStore} from "../store/globalStore";


const AddUsers = () => {
    const [state, dispatch] = useContext(GlobalStore);
    const [users, setUsers] = useState([]);
    const chatRoom = state.chat.currentRoom;

    useEffect(() => {
        if (chatRoom) {
            UserService
                .getUsers(`part_room=${chatRoom.id}`)
                .then(data => {
                    setUsers(data.map(user => ({...user, toAdd: false}) ))
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }, [chatRoom])

    const handleCheck = event => {
        const { checked, value } = event.target;
        setUsers(users.map(user => user.id === parseInt(value) ? {...user, toAdd: checked} : user));
    }

    const AddUsersToRoom = event => {
        if (window.confirm('Are you sure you want to add this user(s) to the room ?')) {
            const promises = [];
            for (let i in users) {
                if (users[i].toAdd) {
                    promises.push(chatService.addUserToRoom({user: users[i].id, room: state.chat.currentRoom.id}))
                }
            }
            Promise.all(promises).then(data => {
                data.forEach(partic => {
                    const userPartic = users.find(user => user.id === partic.user)
                    delete userPartic.toAdd
                    const newParticipant = {id: partic.id, user: userPartic, room: partic.room }
                    setUsers(prevState => prevState.filter(user => user.id !== partic.user))
                    dispatch({type: "ADD_PARTICIPANT", data: newParticipant})
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