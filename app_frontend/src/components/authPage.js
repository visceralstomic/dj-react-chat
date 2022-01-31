
import {useState, forwardRef} from "react";
import LoginForm from "./loginForm";
import RegisterForm from "./registerForm";
import {Snackbar} from "@mui/material" 
import MuiAlert from '@mui/material/Alert';

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


const AuthPage = props => {
    const [toggle, setToggle] = useState(false);
    const [open, setOpen] = useState(false);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }

        setOpen(false);
    };

    return (
        <div className="auth-container">
            <Snackbar anchorOrigin={{horizontal: "center", vertical:"top"}}
                      sx={{top: {sm: "20%"} }}
                      open={open} 
                      onClose={handleClose}
                      autoHideDuration={6000}
            >
                <Alert onClose={handleClose} severity="success">
                    Registration completed successfully! 
                </Alert>
            </Snackbar>
            {toggle ? (
                <RegisterForm toggle={toggle} setToggle={setToggle} setOpen={setOpen}/>
            ) : (
                <LoginForm toggle={toggle} setToggle={setToggle}/>
            )}
        </div>
    )
}

export default AuthPage; 