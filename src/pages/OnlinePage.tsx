import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import '../resources/styles/App.css';
import '../resources/styles/CustomStyleHost.scss'
import { OnlineBattleManager } from '../classes/viewmodel/battle_manager_online';
import MessagesDisplay from './Screen/MessagesDisplay';
import OptionsDisplay from './Screen/OptionsDisplay';
import Button from 'react-bootstrap/Button';

const OnlinePage = (props: any) => {

  const battleManager : OnlineBattleManager = new OnlineBattleManager()

  // Functions
  const joinOnlineBattle = () => {
    battleManager.MySocket.JoinRoom();
  };
  
  // DOM Return
  return (
    <div className="TestWebBody">
      <div className="row">
        <div className="col-12">
          <Button bsPrefix="TestButton MedText" onClick={joinOnlineBattle} size="lg"> Start Online Battle</Button>
        </div>
      </div>
      <div className="row">
        <div className="col-4">
          <div className="TestWebComponentHolder">
            <OptionsDisplay manager={battleManager}/> 
          </div>
        </div>
        <div className="col-8">
          <div className="TestWebComponentHolder">
            <MessagesDisplay manager={battleManager}/>
          </div>
        </div>
      </div>

    </div>
  );
}

export default OnlinePage;
