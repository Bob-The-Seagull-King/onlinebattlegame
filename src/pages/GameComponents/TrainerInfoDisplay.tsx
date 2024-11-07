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
import { IActiveItem } from '../../classes/sim/models/active_item';
import { ItemAction } from '../../global_types';
import TrainerItem from '../Components/Options/TrainerItem';

const TrainerInfoDisplay = (props: any) => {
  const Manager : BattleManager = props.manager; // The manager running this battle
 
  // Collection of options available for the user to choose from
  const [gameState, setGameState] = useState(Manager.BattleState);
  const [relevantTrainer, setRelevantTrainer] = useState(GetRelevantTrainer());
  const [stateKey, setStateKey] = useState(0);
  const [optionsReceived, setOptionsReceived] = useState(Manager.ChoicesLog);  

  // Update the state of options to match the manager
  const receiveState = () => {
    setGameState(Manager.BattleState);
    setStateKey(stateKey + 1)
    setRelevantTrainer(GetRelevantTrainer());
  }



  function GetRelevantTrainer() {
    let returnVal = null;
    Manager.BattleState.sides.forEach(_side => {
      _side.trainers.forEach(_trainer => {
        if ((_trainer.sidepos === Manager.SidePosition) && (_trainer.pos === Manager.BattlePosition)) {
          returnVal = _trainer;
        }
      })
    })
    console.log(returnVal)
    return returnVal
  }

  // Update the state of options to match the manager
  const receiveOptions = () => {
    const options =  Object.assign([], Manager.ChoicesLog);
    setOptionsReceived(options);
  }

  // Assign the relevant function to the manager
  Manager.setOptionsFuncs(receiveOptions)
  

  // Assign the relevant function to the manager
  Manager.addGameUpdater(receiveState)

  function ShowItemOption(item : IActiveItem) {

    console.log("ITEM START")

    let position = -1;
    let turnchar = null;
    let relAction = null;

    let HasAction = false;

    for(let i = 0; i < optionsReceived.length; i++) {
      const option = optionsReceived[i];
      if (option.pos === -1) {        
        if (option.action["ITEM"]) {
          for (let j = 0; j < option.action["ITEM"].length; j++) {
            const action = option.action["ITEM"][j]
            if ((action as ItemAction).item === (relevantTrainer as ITrainer).team.items.indexOf(item)) {
              relAction = action
              turnchar = option;
              HasAction = true;
            }
          }
        }
      }
    }

    return (
      <div>
        <TrainerItem manager={Manager} item={item} trainer={relevantTrainer} displayaction={HasAction} position={position} turn={turnchar} action={relAction}/>
      </div>
    )
  }
  
  return (
    <div className="" key={stateKey}>
      {relevantTrainer != null &&
        <div className="row">
          {(relevantTrainer as ITrainer).team.items.map(_item => 
            <div className="col-4">
              {ShowItemOption(_item)}
            </div>
          )}
        </div>
      }
    </div>
  );
}

export default TrainerInfoDisplay;
