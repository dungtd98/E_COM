import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import { ContextProvider } from "./ultis/Context";
import { 
  HashRouter as Router,
 } from 'react-router-dom'
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  
  <React.StrictMode>
    <Router>
    <ContextProvider>
      <App />
    </ContextProvider>
    </Router>
  </React.StrictMode>
);
