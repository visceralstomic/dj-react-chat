import {useState, useContext} from "react";
import ChatService from "../services/chatService";
import {GlobalStore} from "../store/globalStore";
import { FormGroup, Button, TextField,
        Box, Grid, Container, FromControlLabel } from '@mui/material';



const greenColor = "hsla(147, 100%, 33%, 1)"


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
            <TextField
                fullWidth
                label="Add room"
                variant="standard"
                value={chatName} 
                onChange={handleChange}
                color="primary"

                sx={{
                    "& .MuiFormLabel-root": {
                        color: greenColor
                    },
                    "& .MuiInput-underline:before": {
                        borderBottomColor: "hsla(110, 9%, 50%, 1)"
                    }
                  }}
                
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