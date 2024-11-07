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
  const [leftTrainers, setLeftTrainers] = useState(GetSplitTrainers(true))
  const [rightTrainers, setRightTrainers] = useState(GetSplitTrainers(false))
  
  function GetSplitTrainers(side : boolean) {
    const trainers : ITrainer[] = []

    Manager.BattleState.sides.forEach(_side => {
      _side.trainers.forEach(_trainer => {trainers.push(_trainer)})
    })

    return trainers.slice( (side)? 0 : Math.floor((trainers.length/2)) , (side)? Math.floor((trainers.length/2)) : trainers.length );
  }

  // Update the state of options to match the manager
  const receiveOptions = () => {
    setGameState(Manager.BattleState);
    setStateKey(stateKey + 1)
    setLeftTrainers(GetSplitTrainers(true))
    setRightTrainers(GetSplitTrainers(false))
  }

  // Assign the relevant function to the manager
  Manager.addGameUpdater(receiveOptions)

  function TrainerTopBarUI(_trainer : ITrainer, side: boolean) {

    return (
      <span style={{flex:"1"}}>
      <span className={"MedText " + ((side === true)? "leftnames" : "rightnames")} style={{display:"flex",width:"fit-content",height:"fit-content"}}>
        <div style={{height:"fit-content",marginRight:"0.25rem"}}>
          {((_trainer.sidepos === gameState.current) ) &&
            <TextWobble value={_trainer.name} />
          }
          {((_trainer.sidepos != gameState.current)) &&
            <div>{_trainer.name}</div>
          }
        </div>
        <div style={{height:"fit-content"}}>
        {
          Array.from({ length: _trainer.team.turns }).map((_, i) => 
            <FontAwesomeIcon className='colourSubBlue' icon={faSquare} style={{marginLeft:"0.25rem"}} />
          )
        }
        {
          Array.from({ length: gameState.turns - _trainer.team.turns }).map((_, i) => 
            <FontAwesomeIcon className='colourMainBlue' icon={faSquare} style={{marginLeft:"0.25rem"}} />
          )
        }
        </div>
      </span>
      </span>
    )
  }

  function ReturnRoundCount() {
    return (
      <div className="BiggerText roundcounter" style={{margin:"0px"}} >
         <TextWobble value={gameState.rounds} />
      </div>
    )
  }
  
  return (
    <div className="sticky-nav" key={stateKey}>
      {gameState != null && 
        <div style={{display:"flex",justifyContent:"center"}}>
            {leftTrainers.map(_trainer =>  <>
                    {TrainerTopBarUI(_trainer, true)}
              </> )}
            {
              ReturnRoundCount()
            }
            {rightTrainers.map(_trainer =>  <>
                    {TrainerTopBarUI(_trainer, false)}
              </> )}
        </div>
      }
    </div>
  );
}

export default GameTopBar;
