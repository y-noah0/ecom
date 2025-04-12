import { createContext, useEffect, useReducer } from "react";
import PropTypes from "prop-types";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
    switch(action.type) {
        case "LOGIN":
            console.log("User logged in:", action.payload);
            return {
                user: action.payload
            }
        case "LOGOUT":
            console.log("User logged out");
            return {
                user: null
        }    
        default:
            return state;
    }
}

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null,
    });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if(user) {
            console.log("User found in localStorage:", user);
            dispatch({type: 'LOGIN', payload: user});
        } else {
            console.log("No user found in localStorage");
        }
    }, [])

    return (
        <AuthContext.Provider value={{...state, dispatch}}>
            {children}
        </AuthContext.Provider>
    )
}

AuthContextProvider.propTypes = {
    children: PropTypes.node.isRequired
}