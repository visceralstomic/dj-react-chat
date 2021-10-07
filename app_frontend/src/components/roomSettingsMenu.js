import { useContext, useState } from "react";
import { GlobalStore } from "../store/globalStore";
import chatService from "../services/chatService";
import { Button, Modal, ModalHeader, ModalBody, TabContent, TabPane, Nav, NavItem, NavLink,
  ModalFooter, ListGroup,  } from 'reactstrap';
import classnames from 'classnames';
import Participants from "./participants";
import AddUsers from "./addUsers";


const RoomSettingsMenu = ({show, setShow}) => {
    const [activeTab, setActiveTab] = useState('1');
    const [state, dispatch] = useContext(GlobalStore);
    
    const toggle = tab => {
        if(activeTab !== tab) setActiveTab(tab);
    }

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
                    <Participants />
                </ListGroup>
            </TabPane>
            {state.user.uid === state.chat.currentRoom.creator.id ? (
                <TabPane tabId='2'>
                    <ListGroup className='partic-list'>
                        <AddUsers />
                    </ListGroup>
                </TabPane>
            ) : (
                null
            )}
        </TabContent>
        </ModalBody>
        <ModalFooter>
            {state.user.uid === state.chat.currentRoom.creator.id ? (
                <Button color="danger" onClick={handleDelete} >Delete</Button>
            ) : (
                null
            )}
            <Button variant="secondary" onClick={handleClose}>Close</Button>
        </ModalFooter>
        </Modal>
    )
}

export default RoomSettingsMenu;