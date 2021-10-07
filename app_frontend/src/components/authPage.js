import {useState} from "react";
import LoginForm from "./loginForm";
import RegisterForm from "./registerForm";


const AuthPage = props => {
    const [toggle, setToggle] = useState(false);
    return (
        <div className="auth-container">
            {toggle ? (
                <RegisterForm toggle={toggle} setToggle={setToggle}/>
            ) : (
                <LoginForm toggle={toggle} setToggle={setToggle}/>
            )}
        </div>
    )
}

export default AuthPage; 