import {useState, useContext} from "react";
import UserService from "../services/userService";
import {GlobalStore} from "../store/globalStore";
import {useLocation, useHistory} from "react-router-dom";
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

const LoginForm = props => {
    const { toggle, setToggle} = props;
    const [state, dispatch] = useContext(GlobalStore);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState(null);

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
                setLoginError(error.response.data.error);
                setTimeout(() => {
                    setLoginError(null);
                }, 7000);
            })
    }

    return (
        <>
        <h3>Login</h3>
        <Form onSubmit={handleSubmit}>
            <FormGroup>
                <Label for="usernameinput">Username</Label>
                <Input
                    id="usernameinput"
                    type="text" 
                    value={username}
                    onChange={({target}) => setUsername(target.value)}
                    invalid={loginError !== null} 
                />
            </FormGroup>
            <FormGroup >
                <Label for="passwordinput">Password</Label>
                <Input
                    id="passwordinput" 
                    type="password" 
                    value={password}
                    onChange={({target}) => setPassword(target.value)}
                    invalid={loginError !== null} 
                />
            </FormGroup>
            {loginError ? (
                <FormGroup className="error-message">
                    {loginError}
                </FormGroup>
            ) : (
                null
            )}
            <FormGroup className="form-btns">
                <Button>Log in</Button>
                <span>
                    Not registered ?  <br />  Then <span className="auth-toggle" onClick={() => setToggle(!toggle)}>Sign up</span>
                </span>
            </FormGroup>
        </Form>
        </>
    )
}

export default LoginForm;
