import {useContext} from "react";
import UserService from "../services/userService";
import { GlobalStore } from "../store/globalStore";
import {useHistory} from "react-router-dom";
import { Button} from 'reactstrap';


const Logout = props => {
    const [state, dispatch] = useContext(GlobalStore);  
    const history = useHistory();

    const handleLogout = event => {
        UserService
          .logout()
          .then(data => {
            dispatch({type: 'LOGOUT'});
            console.log('LOGOUT');
            localStorage.removeItem('IsLoggedIn');
            history.replace("/auth");
          })
          .catch(error => {
            console.log(error)
          })
      }
    return (
        <div>
            <Button onClick={handleLogout} >Logout</Button>
        </div>
    )
}

export default Logout;