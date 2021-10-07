import {useState} from "react";
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import UserService from "../services/userService";
import FormError from "./formError";

const RegisterForm = props => {
    const { toggle, setToggle} = props;

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [photo, setPhoto] = useState(null);

    const [usernameError, setUsernameError] = useState(undefined);
    const [passwordError, setPasswordError] = useState(undefined);
    const [password2Error, setPassword2Error] = useState(undefined);
    const [photoError, setPhotoError] = useState(undefined);
    const [error, setError] = useState(null);


    const handleSubmit = event => {
        event.preventDefault();
        let formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        formData.append('password2', password2);
        if (photo) {
            console.log(photo)
            formData.append('photo', photo, photo.name);
        }

        setUsernameError(undefined);
        setPasswordError(undefined);
        setPassword2Error(undefined);
        setPhotoError(undefined);
        setError(null);

        UserService
            .createUser(formData)
            .then(data => {
                setToggle(!toggle);
            })
            .catch(error => {
                console.log(error.response.data)
                for (let i in error.response.data) {
                    switch (i) {
                        case 'username':
                            setUsernameError(error.response.data[i]);
                            break;
                        case 'password':
                            setPasswordError(error.response.data[i]);
                            break;
                        case 'password2':
                            setPassword2Error(error.response.data[i]);
                            break;
                        case 'photo':
                            setPhotoError(error.response.data[i]);
                            break;
                        default:
                            setError(error.response.data[i]);
                    }
                }
            })

    }

    return (
        <>
            <h3>Register</h3>
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label for="usernameinput">Username</Label>
                    <Input
                        id="usernameinput"
                        type="text" 
                        value={username}
                        onChange={({target}) => setUsername(target.value)}
                        invalid={usernameError !== undefined} 
                    />
                    {usernameError ? <FormError message={usernameError} /> : null}
                </FormGroup>
                <FormGroup>
                    <Label for="passwordinput">Password</Label>
                    <Input
                        id="passwordinput" 
                        type="password" 
                        value={password}
                        onChange={({target}) => setPassword(target.value)}
                        invalid={passwordError !== undefined || error !== null}  
                    />
                    {passwordError ? <FormError message={passwordError} /> : null}
                </FormGroup>
                <FormGroup>
                    <Label for="passwor2dinput">Repeat password</Label>
                    <Input
                        id="passwor2dinput" 
                        type="password" 
                        value={password2}
                        onChange={({target}) => setPassword2(target.value)}
                        invalid={password2Error !== undefined || error !== null}  
                    />
                    {password2Error ? <FormError message={password2Error} /> : null}
                    {error ? <FormError message={error} /> : null}
                </FormGroup>
                <FormGroup>
                    <Label for="userPhoto">Photo</Label>
                    <Input 
                        type="file" 
                        name="file" 
                        id="userPhoto" 
                        accept="image/*"
                        onChange={({target}) => setPhoto(target.files[0])}
                        invalid={photoError !== undefined} 
                    />
                    {photoError ? <FormError message={photoError} /> : null}
                </FormGroup>
                <FormGroup className="form-btns">
                    <Button color="success">Create account</Button>
                    <span>
                        Already registered?  <br />Then <span className="auth-toggle" onClick={() => setToggle(!toggle)}>Log in</span>
                    </span>
                </FormGroup>
            </Form>
        </>
    )
}

export default RegisterForm;