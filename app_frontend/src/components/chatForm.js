import {useState, useContext} from "react";
import ChatService from "../services/chatService";
import {GlobalStore} from "../store/globalStore";
import { Form, FormGroup, Input, FormFeedback} from 'reactstrap';
import Button from '@mui/material/Button';

const ChatForm = props => {
    const [state, dispatch] = useContext(GlobalStore);
    const [chatName, setChatName] = useState('');
    const [formError, setError] = useState(null);

    const handleChange = event => {
      if (formError !== null) {
        setError(null)
      }
      setChatName(event.target.value);
    }

    const handleClick = event => {
        event.preventDefault();
        if (chatName.trim() !== '') {
          ChatService
            .createChat({name: chatName})
            .then(data => {
              dispatch({type: 'ADD_CHAT_ROOM', data: {...data, creator: {id: state.user.uid, username: state.user.username}}})
              setChatName('');
            })
            .catch( error => {
              setError(error.response.data.name)
            })
        }
      }
    return (
        <>  
          <Form  onSubmit={handleClick}>
            <FormGroup className="position-relative chat-form-input">
              <Input 
                  value={chatName} 
                  onChange={handleChange}
                  placeholder="Add chat room"
                  invalid={formError !== null}
                  required
              />
              <FormFeedback tooltip>{formError}</FormFeedback>
            </FormGroup>
            
            <FormGroup>
            <Button variant="contained" color="primary">Enter</Button>
            </FormGroup>
          </Form>

        </>
    )
 }

 export default ChatForm;
