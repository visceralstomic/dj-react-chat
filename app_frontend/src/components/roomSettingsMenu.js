import { useContext, useState, useEffect } from "react";
import { GlobalStore } from "../store/globalStore";
import chatService from "../services/chatService";
import classnames from 'classnames';
import Participants from "./participants";
import AddUsers from "./addUsers";
import UserService from "../services/userService";
import {Modal, Box, Typography, Button, Tab, Tabs, List, ListItem, ListItemText, Stack } from "@mui/material";


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 300,
  bgcolor: '#191919',
  color: "hsla(147, 100%, 33%, 1)",
  boxShadow: 24,
  p: 3,
};
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const RoomSettingsMenu = ({show, setShow}) => {
    const [activeTab, setActiveTab] = useState('1');
    const [state, dispatch] = useContext(GlobalStore);
    const [allUsers, setAllUsers] = useState([]);
    const [participants, setParticipants] = useState([]);

    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
      };

    const chatRoom = state.chat.currentRoom;

    
    const toggle = tab => {
        if(activeTab !== tab) setActiveTab(tab);
    }
    
    useEffect(() => {
        UserService
                .getUsers(`part_room=${chatRoom.id}`)
                .then(data => {
                    setAllUsers(data.map(user => ({...user, toAdd: false}) ))
                })
                .catch(err => {
                    console.log(err)
                })
        chatService
                .getRoomParticipants(chatRoom.id)
                .then(data => {

                  setParticipants(data)
                })
                .catch(err => {
                    console.log(err)
                })
    }, [chatRoom])

    const handleClose = () => setShow(false);

    const handleDelete = event => {
        if (window.confirm('Are you sure you want to delete this room ?')){
          chatService
            .deleteRoom(state.chat.currentRoom.id)
            .then(data => {
              dispatch({type: "DELETE_ROOM", data: {id: state.chat.currentRoom.id}})
            })
        }
      }

    return (
        <Modal
            disableEscapeKeyDown
            hideBackdrop
            open={show}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>

                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs  value={value} onChange={handleChange} aria-label="basic tabs example">
                  <Tab label="Participants" {...a11yProps(0)} sx={{ color: "white", textTransform: 'none'}} />
                  {state.user.uid === state.chat.currentRoom.creator.id ? (
                    <Tab label="Users" {...a11yProps(1)} sx={{ color: "white", textTransform: 'none'}} />
                  ) : (
                    null
                  )}
                  
                </Tabs>
                </Box>

                <TabPanel value={value} index={0}>
                    <Participants 
                        participants={participants}
                        setParticipants={setParticipants}
                        setUsers={setAllUsers}
                    />
                </TabPanel>

                {state.user.uid === state.chat.currentRoom.creator.id ? (
                    <TabPanel value={value} index={1}>
                        <AddUsers 
                            users={allUsers} setUsers={setAllUsers}
                            setParticipants={setParticipants}
                        />
                    </TabPanel>
                ) : (
                    null
                )}
                <Stack direction="row" justifyContent="space-between">
                    <Button variant="contained" color="primary" size="small" onClick={handleClose}>Close</Button>
                    {state.user.uid === state.chat.currentRoom.creator.id ? (
                        <Button variant="contained" size="small" color="error" onClick={handleDelete} >Delete room</Button>
                    ) : (
                        null
                    )}
                </Stack> 

                
            </Box>


        </Modal>
        
    )
}

export default RoomSettingsMenu;

/* 

<Modal 
            isOpen={show} 
            size='sm' 
            toggle={handleClose} 
            backdrop={'static'} 
            centered={true} 
            keyboard={false}
        >
        <ModalHeader toggle={handleClose}>
          Room menu
        </ModalHeader>
        <ModalBody>
        <Nav tabs>
            <NavItem className="tab-item">
                    <NavLink
                        className={`${classnames({ active: activeTab === '1' })} text-dark`}
                        onClick={() => { toggle('1'); }}
                    >
                        Participants
                    </NavLink>
            </NavItem>
                {state.user.uid === state.chat.currentRoom.creator.id ? (
                    <NavItem className="tab-item">
                        <NavLink
                            className={`${classnames({ active: activeTab === '2' })} text-dark`}
                            onClick={() => { toggle('2'); }}
                        >
                        Users
                        </NavLink>
                    </NavItem>
                ) : (
                    null
                )}
        </Nav>
        <TabContent activeTab={activeTab}>
            <TabPane tabId='1'>
                <ListGroup className='partic-list'>
                    <Participants 
                        participants={participants}
                        setParticipants={setParticipants}
                        setUsers={setAllUsers}
                    />
                </ListGroup>
            </TabPane>
            {state.user.uid === state.chat.currentRoom.creator.id ? (
                <TabPane tabId='2'>
                    <ListGroup className='partic-list'>
                        <AddUsers 
                            users={allUsers} setUsers={setAllUsers}
                            setParticipants={setParticipants}
                        />
                    </ListGroup>
                </TabPane>
            ) : (
                null
            )}
        </TabContent>
        </ModalBody>
        <ModalFooter>
            {state.user.uid === state.chat.currentRoom.creator.id ? (
                <Button color="danger" onClick={handleDelete} >Delete room</Button>
            ) : (
                null
            )}
            <Button variant="secondary" onClick={handleClose}>Close</Button>
        </ModalFooter>
        </Modal>

*/