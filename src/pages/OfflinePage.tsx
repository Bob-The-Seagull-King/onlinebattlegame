import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import '../resources/styles/App.css';
import '../resources/styles/CustomStyleHost.scss'
import { OfflineBattleManager } from '../classes/viewmodel/battle_manager_local';
import MessagesDisplay from './Screen/MessagesDisplay';
import OptionsDisplay from './Screen/OptionsDisplay';
import Button from 'react-bootstrap/Button';
import PlotsDisplay from './Screen/PlotsDisplay';
import GamePage from './GamePage';

const OfflinePage = (props: any) => {

  // Initialize the battle manager
  const battleManager : OfflineBattleManager = new OfflineBattleManager();
  
  // Prompt the manager to start the battle.
  const joinOfflineBattle = () => {
    battleManager.StartBattle();
  };
  
  return (
    <div>
      <GamePage manager={battleManager} joinmethod={joinOfflineBattle}/>
    </div>
  );
}

export default OfflinePage;
