import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import GlobalStoreProvider from "./store/globalStore";
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import './index.css';


ReactDOM.render(
  <React.StrictMode>
    <GlobalStoreProvider>
      <App />
    </GlobalStoreProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
