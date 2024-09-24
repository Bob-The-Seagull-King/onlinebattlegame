import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import '../resources/styles/App.css';
import '../resources/styles/CustomStyleHost.scss'
import { OfflineBattleManager } from '../classes/viewmodel/battle_manager_local';
import MessagesDisplay from './Screen/MessagesDisplay';
import OptionsDisplay from './Screen/OptionsDisplay';
import Button from 'react-bootstrap/Button';
import PlotsDisplay from './Screen/PlotsDisplay';
import { BattleManager } from '../classes/viewmodel/battle_manager';

const GamePage = (props: any) => {
  const myManager : BattleManager = props.manager;
  const StartGameMethod = props.joinmethod
  
  return (
    <div className="TestWebBody">
      <div className="row">
        <div className="col-6">
          {/** Battle start button */}
          <Button bsPrefix="TestButton MedText ForceHeight15" style={{margin:"0em"}} onClick={StartGameMethod} size="lg"> Start Battle</Button>
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
