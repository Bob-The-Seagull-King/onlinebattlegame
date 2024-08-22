import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import '../resources/styles/App.css';
import { OnlineBattleManager } from '../classes/viewmodel/battle_manager_online';

const OnlinePage = (props: any) => {

  const battleManager : OnlineBattleManager = new OnlineBattleManager()

  // Functions
  const joinOnlineBattle = () => {
    battleManager.MySocket.JoinRoom();
  };
  
  // DOM Return
  return (
    <div className="App">
      <button onClick={joinOnlineBattle}> Join Online Battle</button>
    </div>
  );
}

export default OnlinePage;
