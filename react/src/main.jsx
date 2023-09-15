import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { MyContext } from "./Context/ContextProvider";
import "./index.css";
import router from "./router";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MyContext.Provider
      value={{
        text: "hello",
      }}
    >
      <RouterProvider router={router} />
    </MyContext.Provider>
  </React.StrictMode>
);
