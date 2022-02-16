import {useState, useEffect, useRef, useContext} from "react";
import {GlobalStore} from "../store/globalStore";
import "./chat.css";
import ChatMessage  from "./chatMessage";
import { Button} from 'reactstrap';
import { SOCKET_URL } from "../services/globalAxios";
import {FaArrowLeft} from "react-icons/fa";
import RoomSettingsMenu from "./roomSettingsMenu";

const Chat = props => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessages] = useState('');
    const [toggle, setToggle] = useState(false);
    const [state, dispatch] = useContext(GlobalStore);
    const socket = useRef(null);
    const chatLogRef = useRef();
    const chatRoom = state.chat.currentRoom;  

    useEffect(() => {
      chatLogRef.current.scrollIntoView({ behavior: "auto" });
    }, [messages])

    useEffect(()=> {
        socket.current =  new WebSocket(`${SOCKET_URL}/ws/chat/${chatRoom.id}/`);
        socket.current.addEventListener('open', (event) => {
            //console.log('OPEN!');
            socket.current.send(JSON.stringify({
              'command': 'fetch_messages'
            }))
          });
      
        socket.current.addEventListener('close', (event) => {
            //console.error(event)
          });
      
        socket.current.addEventListener('message', (event) => {
            const data = JSON.parse(event.data);
            switch(data.command) {
              case 'messages':
                setMessages(data.messages);
                break;
              case 'new_message':
                setMessages(prevState => [...prevState, data.message]);
                setNewMessages('');
                break;
              default: break;
            }    
          });
          return () => socket.current.close()
    }, [chatRoom] )
    
    const sendMessage = event => {
      if (newMessage.trim() !== '') {
        socket.current.send(JSON.stringify({
          'message': newMessage,
          'command': 'new_message',
          'from': {
              'id': state.user.uid,
              'username': state.user.username
          }
        }))
      }
        
    }

    return (
        <div className='chat-area'>
          
            <div className="chat-header">
              <FaArrowLeft 
                onClick={() => {
                  dispatch({
                    type: 'SET_NO_ROOM'
                  })
                }}
                className="to-side-bar" 
              />
              {chatRoom.name}
              <div className="header-buttons">
                <Button onClick={() => setToggle(true)}>Menu</Button>
              </div>
            </div>
            <div className="chat-log" >
              {messages.map(message => {
                return   <ChatMessage
                            key={message.create_date} 
                            author={message.author}
                            text={message.text}
                            user={state.user}
                            date={message.create_date}
                          />
              })}
              <div
                style={{ float: "left", clear: "both" }}
                ref={chatLogRef}
              />
            </div>
            <div className="chat-input-panel">
                  <textarea
                    className="message-input"
                    value={newMessage} 
                    onChange={({target}) => setNewMessages(target.value)} 
                    type="text"
                    cols="30"
                    rows="1"
                  />

                  <Button onClick={sendMessage}>Send</Button>
            </div>
            <RoomSettingsMenu show={toggle} setShow={setToggle} />
      </div>
    )
}

export default Chat;