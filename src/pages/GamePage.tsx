import 'bootstrap/dist/css/bootstrap.css';
import React, { useEffect } from 'react';
import '../resources/styles/App.css';
import '../resources/styles/CustomStyleHost.scss'
import { OfflineBattleManager } from '../classes/viewmodel/battle_manager_local';
import MessagesDisplay from './Screen/MessagesDisplay';
import OptionsDisplay from './Screen/OptionsDisplay';
import Button from 'react-bootstrap/Button';
import PlotsDisplay from './Screen/PlotsDisplay';
import { BattleManager } from '../classes/viewmodel/battle_manager';
import TextWobble from './SubComponents/Generics/TextWobble';
import GameTopBar from './GameComponents/GameTopBar';

const GamePage = (props: any) => {
  const myManager : BattleManager = props.manager;
  const StartGameMethod = props.joinmethod

  useEffect(() => {
    // Check if myManager is not null
    if (myManager !== null) {
      // Run your function here
      StartGameMethod();
    }
  }, [myManager]);

  const receiveMessage = () => {
    console.log("MESSAGE")
  }
  // Assign the relevant function to the manager
  myManager.setResultFuncs(receiveMessage)
  
  return (
    <div>
    <div>
        <GameTopBar manager={myManager} />
      </div>
    <div className="TestWebBody">
      
      <div className="row">
        <div className="col-12">
          <div className="TestWebComponentHolder">
            {/** Display user choices */}
            <OptionsDisplay manager={myManager}/> 
          </div>
        </div>
      </div>

    </div>
    </div>
  );
}

export default GamePage;
