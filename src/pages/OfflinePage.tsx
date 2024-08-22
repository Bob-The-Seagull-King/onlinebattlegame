import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import '../resources/styles/App.css';
import { OfflineBattleManager } from '../classes/viewmodel/battle_manager_local';
import MessagesDisplay from './Screen/MessagesDisplay';
import OptionsDisplay from './Screen/OptionsDisplay';

const OfflinePage = (props: any) => {

  // Messages States
  const battleManager : OfflineBattleManager = new OfflineBattleManager();
  
  // Functions
  const joinOfflineBattle = () => {
    battleManager.StartBattle();
  };

  function testBattle() {
    if (battleManager.GameBattle) {
      battleManager.GetTurnsTest();
    }
  }
  
  // DOM Return
  return (
    <div className="App">
      <button onClick={testBattle}> Join test Battle</button>
      <button onClick={joinOfflineBattle}> Join Offline Battle</button>
      <MessagesDisplay manager={battleManager}/>
      <OptionsDisplay manager={battleManager}/>
    </div>
  );
}

export default OfflinePage;
