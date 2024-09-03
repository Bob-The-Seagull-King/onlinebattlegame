import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import './resources/styles/App.css';
import './resources/styles/CustomStyleHost.scss';
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/es/integration/react'
import { persistor, store } from './store/reducers/store'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { ROUTES } from './resources/routes-constants'

import { PlayManager } from './classes/viewmodel/play_manager';
import { ManagerStore } from './classes/viewmodel/manager_store_static';

import OfflinePage from './pages/OfflinePage';
import OnlinePage from './pages/OnlinePage';
import StartGameSpace from './pages/Spaces/StartGameSpace';
import HomePage from './pages/HomePage';


function App() {
  
  const User : PlayManager = ManagerStore.ReturnUserInformation();

  return (
    <div>
      <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
              <Router>  
                  <Routes>
                    <Route path={ROUTES.HOME_PAGE} element={<StartGameSpace user={User}/>} />
                    <Route path={ROUTES.OFFLINE_ROUTE} element={<OfflinePage/>} />
                    <Route path={ROUTES.ONLINE_ROUTE} element={<OnlinePage/>} />
                  </Routes>
              </Router>
          </PersistGate>
      </Provider>
    </div>
  );
}

export default App;
