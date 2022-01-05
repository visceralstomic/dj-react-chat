import {useState, useContext} from "react";
import ChatService from "../services/chatService";
import {GlobalStore} from "../store/globalStore";
import { Form, FormGroup, Input, FormFeedback} from 'reactstrap';

import Button from '@mui/material/Button';
import { makeStyles } from '@mui/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';


const theme = createTheme({
  palette: {
    primary: {
      main: "hsla(147, 100%, 33%, 1)",
    },
  },
});


const useStyles = makeStyles((theme) => ({
  root: {
    color: "#191919",
  }
}));

const ChatForm = props => {
    const classes = useStyles() 
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
        <>  
          <Form  onSubmit={handleClick}>
            <FormGroup className="position-relative chat-form-input">
            
              <TextField
                id="standard-basic"
                label="Add room"
                variant="standard"
                value={chatName} 
                onChange={handleChange}
                
              />
              <FormFeedback tooltip>{formError}</FormFeedback>
            </FormGroup>
            
            <FormGroup>

              <ThemeProvider theme={theme}>
                <Button 
                  className={classes.root}
                  variant="contained" 
                  color="primary"
                  onClick={handleClick}
                >
                  Enter
                </Button>
              </ThemeProvider>
              
            </FormGroup>
          </Form>

        </>
    )
 }

 export default ChatForm;


/*<Input 
                  value={chatName} 
                  onChange={handleChange}
                  placeholder="Add chat room"
                  invalid={formError !== null}
                  required
/> */