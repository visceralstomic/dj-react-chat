import {useState, useContext} from "react";
import ChatService from "../services/chatService";
import {GlobalStore} from "../store/globalStore";
import CustomTextField from "../utils/customTextField";
import { FormGroup, Button, 
        Box, Grid, Container, FromControlLabel } from '@mui/material';



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
              dispatch({type: 'ADD_CHAT_ROOM', 
                data: {...data, 
                creator: {id: state.user.uid, username: state.user.username}}}
                )
              setChatName('');
            })
            .catch( error => {
              setError(error.response.data.name)
            })
        }
      }
    return (

          <Box  component="form" onSubmit={handleClick} noValidate>

            <CustomTextField
                fullWidth
                label="Add room"
                variant="standard"
                value={chatName} 
                onChange={handleChange}
                color="primary"
                
            />

            <Button 
                  variant="contained" 
                  color="primary"
                  onClick={handleClick}
                  sx={{mt: 1}}
             >
                  Enter
            </Button>
          </Box>  

    )
 }

 export default ChatForm;