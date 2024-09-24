import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import '../resources/styles/App.css';
import '../resources/styles/CustomStyleHost.scss'
import { OnlineBattleManager } from '../classes/viewmodel/battle_manager_online';
import MessagesDisplay from './Screen/MessagesDisplay';
import OptionsDisplay from './Screen/OptionsDisplay';
import Button from 'react-bootstrap/Button';
import PlotsDisplay from './Screen/PlotsDisplay';
import GamePage from './GamePage';

const OnlinePage = (props: any) => {

  // Initialize the battle manager
  const battleManager : OnlineBattleManager = new OnlineBattleManager()

  // Prompt the manager to join a room
  const joinOnlineBattle = () => {
    battleManager.MySocket.JoinRoom();
  };
  
  return (    
    <div>
      <GamePage manager={battleManager} joinmethod={joinOnlineBattle}/>
    </div>
  );
}

export default OnlinePage;
