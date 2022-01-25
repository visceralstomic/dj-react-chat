import {useState, useContext} from "react";
import UserService from "../services/userService";
import {GlobalStore} from "../store/globalStore";
import {useLocation, useHistory} from "react-router-dom";
import {Button, Box} from "@mui/material";
import CustomTextField from "../utils/customTextField";



const LoginForm = props => {
    const { toggle, setToggle} = props;
    const [state, dispatch] = useContext(GlobalStore);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    const [usernameError, setUsernameError] = useState(null);
    const [passwordError, setPasswordeError] = useState(null);

    let history = useHistory();
    let location = useLocation();
    let { from } = location.state || { from: { pathname: "/" } };

    const handleSubmit = event => {
        event.preventDefault();
        UserService
            .login({username, password})
            .then(data => {
                dispatch({
                    type: 'SET_USER',
                    data: {
                        id: data.id,
                        username: data.username,
                        photo: data.photo
                    }
                });
                localStorage.setItem('IsLoggedIn', true);
                history.replace(from);
            })
            .catch(error => {
                setUsernameError(error.response.data.username || error.response.data.error );
                setPasswordeError(error.response.data.password || error.response.data.error);
                setTimeout(() => {
                    setUsernameError(null);
                    setPasswordeError(null);
                }, 7000);
            })
    }

    return (
        <>
        <h3>Login</h3>
        <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
            <CustomTextField 
                fullWidth
                required
                error={usernameError !== null}
                margin="normal"
                label="Username"
                value={username}
                onChange={({target}) => setUsername(target.value)}
                helperText={usernameError !== null ? usernameError : null}
            />
            <CustomTextField
                fullWidth
                required
                error={passwordError != null}
                margin="normal" 
                label="Password"
                type="password"
                value={password}
                onChange={({target}) => setPassword(target.value)}
                helperText={passwordError !== null ? passwordError : null}
            />
            <Box className="form-btns">
                <Button variant="contained" color="primary" type="submit" sx={{mt: 1, mb: 1}}>Log in</Button>
                 <span>
                    Not registered ?  <br />  Then <span className="auth-toggle" onClick={() => setToggle(!toggle)}>Sign up</span>
                 </span>
            </Box>
        </Box>
        </>
    )
}

export default LoginForm;


