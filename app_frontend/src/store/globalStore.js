import { createContext, useReducer, useEffect } from "react";
import { initState, reducer } from "./reducers/globalReducer";
import UserService from "../services/userService";


export const GlobalStore = createContext();

const GlobalStoreProvider = ({children}) => {
    const [state, dispatch] = useReducer(reducer, initState);
    useEffect(() => {
          if (localStorage.getItem('IsLoggedIn')) {
            UserService
              .getUser()
              .then(data => {

                dispatch({
                  type: 'SET_USER',
                  data: {
                      id: data.id,
                      username: data.username,
                      photo: data.photo
                  }
                })
              })
              .catch(error => {
                console.error(error)
              });
          }
      }, [])
    
    return (
        <GlobalStore.Provider value={[state, dispatch]}>
            {children}
        </GlobalStore.Provider>
    )
}

export default GlobalStoreProvider;