import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import axios from "axios";
import store from './storege/store';

axios.defaults.baseURL = 'http://localhost:3001/api/';

axios.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    console.log(`Error code:${error.response.status}`);
    return undefined;
});

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Provider store={store}>
                <App/>
            </Provider>
        </BrowserRouter>
    </React.StrictMode>,
)
