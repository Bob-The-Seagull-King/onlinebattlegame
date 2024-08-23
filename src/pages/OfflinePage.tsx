import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import '../resources/styles/App.css';
import '../resources/styles/CustomStyleHost.scss'
import { OfflineBattleManager } from '../classes/viewmodel/battle_manager_local';
import MessagesDisplay from './Screen/MessagesDisplay';
import OptionsDisplay from './Screen/OptionsDisplay';
import Button from 'react-bootstrap/Button';

const OfflinePage = (props: any) => {

  // Messages States
  const battleManager : OfflineBattleManager = new OfflineBattleManager();
  
  // Functions
  const joinOfflineBattle = () => {
    battleManager.StartBattle();
  };
  
  // DOM Return
  return (
    <div className="App">
      <div className="row">
        <div className="col-12">
          <Button onClick={joinOfflineBattle} size="lg"> Join Offline Battle</Button>
        </div>
      </div>
      <div className="row">
        <div className="col-4">
          <div className="BasicElementContainer CapHeight80">
            <OptionsDisplay manager={battleManager}/>
          </div>
        </div>
        <div className="col-8">
          <div className="BasicElementContainer CapHeight80">
            <MessagesDisplay manager={battleManager}/>
          </div>
        </div>
      </div>

    </div>
  );
}

export default OfflinePage;
