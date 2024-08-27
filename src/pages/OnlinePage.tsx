import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import '../resources/styles/App.css';
import '../resources/styles/CustomStyleHost.scss'
import { OnlineBattleManager } from '../classes/viewmodel/battle_manager_online';
import MessagesDisplay from './Screen/MessagesDisplay';
import OptionsDisplay from './Screen/OptionsDisplay';
import Button from 'react-bootstrap/Button';

const OnlinePage = (props: any) => {

  // Initialize the battle manager
  const battleManager : OnlineBattleManager = new OnlineBattleManager()

  // Prompt the manager to join a room
  const joinOnlineBattle = () => {
    battleManager.MySocket.JoinRoom();
  };
  
  return (
    <div className="TestWebBody">
      <div className="row">
        <div className="col-12">
          {/** Battle start button */}
          <Button bsPrefix="TestButton MedText" onClick={joinOnlineBattle} size="lg"> Start Online Battle</Button>
        </div>
      </div>
      <div className="row">
        <div className="col-6">
          <div className="TestWebComponentHolder">
            {/** Display user choices */}
            <OptionsDisplay manager={battleManager}/> 
          </div>
        </div>
        <div className="col-6">
          <div className="TestWebComponentHolder">
            {/** Display battle text log */}
            <MessagesDisplay manager={battleManager}/>
          </div>
        </div>
      </div>

    </div>
  );
}

export default OnlinePage;
