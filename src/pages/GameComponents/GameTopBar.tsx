import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';

import '../../resources/styles/App.css';
import { useState } from "react";
import { BattleManager } from '../../classes/viewmodel/battle_manager';
import { ITrainer } from '../../classes/sim/controller/trainer/trainer_basic';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquare  } from '@fortawesome/free-solid-svg-icons'
import TextWobble from '../SubComponents/Generics/TextWobble';

const GameTopBar = (props: any) => {
  const Manager : BattleManager = props.manager; // The manager running this battle
 
  // Collection of options available for the user to choose from
  const [gameState, setGameState] = useState(Manager.BattleState);
  const [stateKey, setStateKey] = useState(0);
  
  // Update the state of options to match the manager
  const receiveOptions = () => {
    console.log("UPDATE STATE")
    setGameState(Manager.BattleState);
    setStateKey(stateKey + 1)
  }

  // Assign the relevant function to the manager
  Manager.addGameUpdater(receiveOptions)

  function TrainerTopBarUI(_trainer : ITrainer) {

    return (
      <span className="MedText" style={{display:"flex"}}>
        <div >
          {((_trainer.sidepos === gameState.current) ) &&
            <TextWobble value={_trainer.name} />
          }
          {((_trainer.sidepos != gameState.current)) &&
            <div>{_trainer.name}</div>
          }
        </div>
        <div>
        {
          Array.from({ length: _trainer.team.turns }).map((_, i) => 
            <FontAwesomeIcon className='colourSubBlue' icon={faSquare} />
          )
        }
        {
          Array.from({ length: gameState.turns - _trainer.team.turns }).map((_, i) => 
            <FontAwesomeIcon className='colourMainBlue' icon={faSquare} />
          )
        }
        </div>
      </span>
    )
  }

  function ReturnRoundCount() {
    return (
      <div className="BigText">
         <TextWobble value={gameState.rounds} />
      </div>
    )
  }
  
  return (
    <div className="sticky-nav" key={stateKey}>
      {gameState != null && 
        <div>
            {gameState.sides.map(_side => 
              <div style={{display:"flex"}}> {_side.trainers.map(_trainer =>  <>
                    {TrainerTopBarUI(_trainer)}
              </> )} </div>
            )}
            {
              ReturnRoundCount()
            }
        </div>
      }
    </div>
  );
}

export default GameTopBar;
