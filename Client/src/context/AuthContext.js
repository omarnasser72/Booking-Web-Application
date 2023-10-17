import { createContext, useEffect, useReducer } from "react";

const userString = localStorage.getItem("user");
let user = null;
try {
  user = JSON.parse(userString); //to initialize the user state with the value stored in the browser's local storage
} catch (error) {
  console.log("Error parsing user from local storage:", error); //If there is no value stored in the local storage, the user state is initialized with null.
}

const tokenString = localStorage.getItem("accessToken");
let token = null;
try {
  token = JSON.parse(tokenString); //to initialize the user state with the value stored in the browser's local storage
} catch (error) {
  console.log("Error parsing token from local storage:", error); //If there is no value stored in the local storage, the user state is initialized with null.
}

const INTIAL_STATE = {
  user,
  accessToken,
  loading: false,
  error: null,
};

export const AuthContext = createContext(INTIAL_STATE);

const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        user: null,
        accessToken: null,
        loading: true,
        error: null,
      };
    case "LOGIN_SUCCESS":
      return {
        user: action.payload,
        accessToken: action.accessToken,
        loading: false,
        error: null,
      };
    case "LOGIN_FALIURE":
      return {
        user: null,
        accessToken: null,
        loading: false,
        error: action.payload,
      };
    case "LOGOUT":
      return {
        user: null,
        accessToken: null,
        loading: false,
        error: null,
      };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INTIAL_STATE);

  useEffect(() => {
    localStorage.setItem("accessToken", state.accessToken);
    localStorage.setItem("user", JSON.stringify(state.user)); // a function to be executed after rendering
  }, [state.user]); // function executes when user's state changes
  return (
    <AuthContext.Provider
      value={{
        accessToken: state.accessToken,
        user: state.user,
        loading: state.loading,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
