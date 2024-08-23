import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import '../resources/styles/App.css';
import '../resources/styles/CustomStyleHost.scss'
import { OnlineBattleManager } from '../classes/viewmodel/battle_manager_online';
import MessagesDisplay from './Screen/MessagesDisplay';
import OptionsDisplay from './Screen/OptionsDisplay';
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";

const HomePage = (props: any) => {
 
  const navigate = useNavigate();

  function NavigateAround(dir: string) {
      navigate('/' + dir);
  }
  
  // DOM Return
  return (   
    <div className="TestWebBody">
      <div className="row">
        <div className="col-6">
          <Button bsPrefix="TestButton MedText" onClick={() => NavigateAround("online")} size="lg">Online Play</Button>
        </div>
        <div className="col-6">
          <Button bsPrefix="TestButton MedText" onClick={() => NavigateAround("offline")} size="lg">Offline Play</Button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
