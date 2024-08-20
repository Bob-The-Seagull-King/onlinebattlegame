import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import logo from './resources/images/logo.svg';
import './resources/styles/App.css';
import * as io from "socket.io-client";
import { useEffect, useState } from "react";
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/es/integration/react'
import { persistor, store } from './store/reducers/store'
import { SocketManager } from './classes/structure/connection/SocketManager'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { ROUTES } from './resources/routes-constants'
import HomePage from './pages/HomePage';

const appsocketmanager = new SocketManager();

function App() {
  
  return (
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <Router>
                <Routes>
                    <Route path={ROUTES.HOME_ROUTE} element={<HomePage socket={appsocketmanager}/>} />
                </Routes>
            </Router>
        </PersistGate>
    </Provider>
  );
}

export default App;
