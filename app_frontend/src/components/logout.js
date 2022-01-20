import {useContext} from "react";
import UserService from "../services/userService";
import { GlobalStore } from "../store/globalStore";
import {useHistory} from "react-router-dom";
import {Button} from "@mui/material";
import {ThemeProvider, createTheme} from "@mui/material/styles";



const greenColor = "hsla(147, 100%, 33%, 1)"

const theme = createTheme({
    palette: {
        primary: {
            main: greenColor,
            contrastText: "#191919"
        },
        text: {
          primary: "#ffffff"
        },

    }
})


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
        <ThemeProvider theme={theme}>
            <Button 
                onClick={handleLogout}
                variant="contained"
                color="primary"
            >
                Logout
            </Button>
        </ThemeProvider>
    )
}

export default Logout;