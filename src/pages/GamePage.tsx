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
  
  return (
    <div className="TestWebBody">
      <div>
        <GameTopBar manager={myManager} />
      </div>
      <div className="row">
        <div className="col-6">
          {/** Battle start button */}
          <Button bsPrefix="TestButton BigText ForceHeight15" style={{margin:"0em"}} size="lg"> <TextWobble value={"Start Battle"}/> </Button>
        </div>
        <div className="col-6">
            {/** Display battle text log */}
            <MessagesDisplay manager={myManager}/>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="TestWebComponentHolder">
            {/** Display user choices */}
            <OptionsDisplay manager={myManager}/> 
          </div>
        </div>
      </div>

    </div>
  );
}

export default GamePage;
