import {useState} from "react";
import UserService from "../services/userService";
import {Button, Box, Input, FormHelperText} from "@mui/material";
import CustomTextField from "../utils/customTextField";


const RegisterForm = props => {
    const { toggle, setToggle, setOpen} = props;

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [photo, setPhoto] = useState(null);

    const [usernameError, setUsernameError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [password2Error, setPassword2Error] = useState(null);
    const [photoError, setPhotoError] = useState(null);
    const [error, setError] = useState(null);


    const handleSubmit = event => {
        event.preventDefault();
        let formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        formData.append('password2', password2);
        if (photo) {
            formData.append('photo', photo, photo.name);
        }

        setUsernameError(null);
        setPasswordError(null);
        setPassword2Error(null);
        setPhotoError(null);
        setError(null);

        UserService
            .createUser(formData)
            .then(data => {
                setToggle(!toggle);
                setOpen(true);
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
                setTimeout(() => {
                    setUsernameError(null);
                    setPasswordError(null);
                    setPassword2Error(null);
                    setPhotoError(null);
                    setError(null);
                }, 7000)
            })

    }

    return (
        <>  
            <h3>Register</h3>
            <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
                <CustomTextField 
                    fullWidth
                    required
                    error={usernameError !== null || error !== null}
                    margin="normal"
                    label="Username"
                    value={username}
                    onChange={({target}) => setUsername(target.value)}
                    helperText={usernameError !== null ? usernameError : null}
                />
                <CustomTextField
                    fullWidth
                    required
                    error={passwordError !== null || error !== null}
                    margin="normal" 
                    label="Password"
                    type="password"
                    value={password}
                    onChange={({target}) => setPassword(target.value)}
                    helperText={passwordError !== null ? passwordError : null}
                />
                <CustomTextField
                    fullWidth
                    required
                    error={password2Error !== null || error !== null}
                    margin="normal" 
                    label="Repeat password"
                    type="password"
                    value={password2}
                    onChange={({target}) => setPassword2(target.value)}
                    helperText={password2Error !== null ? password2Error : null}
                />
                {error !== null ? (
                    <FormHelperText error={error !== null}>
                        {error}
                    </FormHelperText>
                ) : null} 
                <input 
                    type="file" 
                    name="file" 
                    id="userPhoto" 
                    accept="image/*"
                    onChange={({target}) => setPhoto(target.files[0])}
                />
                {photoError !== null ? (
                    <FormHelperText error={photoError !== null || error !== null}>
                        {photoError}
                    </FormHelperText>
                ) : null}                  
                <Box className="form-btns">
                    <Button variant="contained" color="primary" type="submit" sx={{mt: 1, mb: 1}}>Create account</Button>
                    <span>
                        Already registered?  <br />Then <span className="auth-toggle" onClick={() => setToggle(!toggle)}>Log in</span>
                    </span>
                </Box>
            </Box>
            
        </>
    )
}

export default RegisterForm;
