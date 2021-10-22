import {useContext} from "react";
import './App.css';
import Chat from "./components/chat";
import AuthPage from "./components/authPage";
import {GlobalStore} from "./store/globalStore";
import RoomList from "./components/roomList";
import ChatForm from "./components/chatForm";
import { Jumbotron, Container, Spinner } from 'reactstrap';
import Logout from "./components/logout";
import {BrowserRouter as Router, Switch, Route } from "react-router-dom";
import AuthRouter from "./utils/authRouter";
import UserImage from "./components/userImage";


const App = () => {
  const [state, dispatch] = useContext(GlobalStore);
  const chatRoom = state.chat.currentRoom;
  return (
    <div className="app">
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
                        <Jumbotron fluid>
                          <Container fluid>
                            <h1 className="display-4">Select chat room or create one</h1>
                          </Container>
                        </Jumbotron>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className='loader' >
                  <Spinner  color="dark"/> 
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
    </div>
  )
}

export default App;
