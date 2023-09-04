import { createContext, useContext, useEffect, useState } from "react";
import ls from "localstorage-slim";
const StateContext = createContext({
  currentUser: null,
  userToken: null,
  setCurrentUser: () => {},
  setUserToken: () => {},
});

export const ContextProvider = ({ children }) => {
  ls.config.encrypt = true;
  const [currentUser, _setCurrentUser] = useState(ls.get("user"));
  const [userToken, _setUserToken] = useState(ls.get("ACCESS_TOKEN"));

  const setCurrentUser = (user) => {
    console.log(user)
    ls.set("user", user);

    _setCurrentUser(user);
  };
  const setUserToken = (token) => {
    console.log(token)
    ls.set("ACCESS_TOKEN", token);

    _setCurrentUser(token);
  };

  return (
    <StateContext.Provider
      value={{
        currentUser,
        userToken,
        setCurrentUser,
        setUserToken,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const userStateContext = () => useContext(StateContext);
