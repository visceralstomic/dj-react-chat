import {Redirect, Route} from "react-router-dom";


const AuthRouter = ({children, auth, ...rest}) => {

    const loggedIn = localStorage.getItem('IsLoggedIn');
    return (
        <Route
            {...rest}
            render={({location}) => 
                loggedIn ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: "/auth",
                            state: { from: location }
                        }}
                    />
                )
            }
        />
    )

}

export default AuthRouter;