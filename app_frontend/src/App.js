import {useContext} from "react";
import './App.css';
import Chat from "./components/chat";
import AuthPage from "./components/authPage";
import {GlobalStore} from "./store/globalStore";
import RoomList from "./components/roomList";
import ChatForm from "./components/chatForm";
import Logout from "./components/logout";
import {BrowserRouter as Router, Switch, Route } from "react-router-dom";
import AuthRouter from "./utils/authRouter";
import UserImage from "./components/userImage";
import {Card, CardContent, Typography, CircularProgress} from "@mui/material";  
import {createTheme, ThemeProvider } from "@mui/material/styles";


const greenColor = "hsla(147, 100%, 33%, 1)"

const theme = createTheme({
  palette: {
    primary: {
      main: greenColor,
      contrastText: "#191919",
      disabled: "hsla(0, 0%, 77%, 1)"
    },
    text: {
      primary: "#ffffff"
    },
    border: {
      primary: greenColor
    },
    action: {
      disabledBackground: "hsla(0, 0%, 77%, 0.32)", 
      disabled: "hsla(0, 3%, 11%, 1)"
    }
  },
});



const App = () => {
  const [state, dispatch] = useContext(GlobalStore);
  const chatRoom = state.chat.currentRoom;
  return (
    <div className="app">
      <ThemeProvider theme={theme}>
        <Router>
        <Switch>
          <AuthRouter exact path="/">
              <div className={`chat-container ${state.chat.currentRoom ? 'active-room' : 'no-active-room'}`}>

              {!state.loading ? (
                <>
                   <div className="side-bar" >

                    <div className="side-header">
                      <div className="user-panel">
                        <UserImage photo={state.user.photo} />
                        {state.user.username} 
                      </div>

                      <div className="logout-panel">
                        <Logout />
                      </div>
                    </div>

                    <div className="chat-form-panel">
                      <ChatForm />
                    </div>

                    <div className="side-menu">
                      <RoomList />
                    </div>

                  </div>

                  <div className='main'>
                    {chatRoom ? (
                      <Chat /> 
                    ) : ( 
                      <div className='empty-main'>

                        <Card sx={{ p: 1, color: "#191919", backgroundColor: "hsla(110, 0%, 77%, 1)", pt: 7, pb: 7 }}>
                          <Typography variant="h2">
                            Select chat room or create one
                          </Typography>
                        </Card>
                      </div>
                    )}
                  </div>
                </>
              ) : (

                <div className='loader' >
                  <CircularProgress sx={{color: "hsla(147, 100%, 33%, 1)", }}/> 
                </div>
              )} 

              </div>
          </AuthRouter>

        <Route exact path="/auth">
          <div className="auth-page">
            <AuthPage />
          </div>
        </Route>
        </Switch>
      </Router>
      </ThemeProvider>
    </div>
  )
}

export default App;
