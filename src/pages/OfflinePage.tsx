import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import '../resources/styles/App.css';
import '../resources/styles/CustomStyleHost.scss'
import { OfflineBattleManager } from '../classes/viewmodel/battle_manager_local';
import MessagesDisplay from './Screen/MessagesDisplay';
import OptionsDisplay from './Screen/OptionsDisplay';
import Button from 'react-bootstrap/Button';
import PlotsDisplay from './Screen/PlotsDisplay';

const OfflinePage = (props: any) => {

  // Initialize the battle manager
  const battleManager : OfflineBattleManager = new OfflineBattleManager();
  
  // Prompt the manager to start the battle.
  const joinOfflineBattle = () => {
    battleManager.StartBattle();
  };
  
  return (
    <div className="TestWebBody">
      <div className="row">
        <div className="col-12">
          {/** Battle start button */}
        </div>
      </div>
      <div className="row">
        <div className="col-6">
          <div className="TestWebComponentHolder">
            {/** Display user choices */}
          <Button bsPrefix="TestButton MedText" onClick={joinOfflineBattle} size="lg"> Start Local Battle</Button>
          </div>
          <div className="TestWebComponentHolder">
            {/** Display user choices */}
            <OptionsDisplay manager={battleManager}/> 
          </div>
          <div className="TestWebComponentHolder">
            {/** Display battle text log */}
            <MessagesDisplay manager={battleManager}/>
          </div>
        </div>
        <div className="col-6">
          <PlotsDisplay  manager={battleManager}/>
        </div>
      </div>

    </div>
  );
}

export default OfflinePage;
