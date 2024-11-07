import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import '../../resources/styles/App.css';
import { useState } from "react";
import { BattleManager } from '../../classes/viewmodel/battle_manager';
import { ITrainer } from '../../classes/sim/controller/trainer/trainer_basic';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquare  } from '@fortawesome/free-solid-svg-icons'
import TextWobble from '../SubComponents/Generics/TextWobble';
import { IActiveItem } from '../../classes/sim/models/active_item';
import { ItemAction, PlaceAction, SwapAction } from '../../global_types';
import TrainerItem from '../Components/Options/TrainerItem';
import { IActiveMonster } from '../../classes/sim/models/active_monster';
import TrainerMonster from '../Components/Options/TrainerMonster';

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

  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 6
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 6
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 3
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 2
    }
  };

  function GetRelevantTrainer() {
    let returnVal = null;
    Manager.BattleState.sides.forEach(_side => {
      _side.trainers.forEach(_trainer => {
        if ((_trainer.sidepos === Manager.SidePosition)) {
          returnVal = _trainer;
        }
      })
    })
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
      <div >
        <TrainerItem manager={Manager} item={item} key={stateKey} trainer={relevantTrainer} displayaction={HasAction} position={position} turn={turnchar} action={relAction}/>
      </div>
    )
  }

  function ShowMonsterOption(item : IActiveMonster) {

    let position = -1;
    let turnchar = null;
    let relAction = null;

    let HasAction = false;

    for(let i = 0; i < optionsReceived.length; i++) {
      const option = optionsReceived[i];
      if (option.pos === -1) {        
        if (option.action["PLACE"]) {
          for (let j = 0; j < option.action["PLACE"].length; j++) {
            const action = option.action["PLACE"][j]
            if ((action as PlaceAction).monster_id === (relevantTrainer as ITrainer).team.monsters.indexOf(item)) {
              relAction = action
              turnchar = option;
              HasAction = true;
            }
          }
        }      
        if (option.action["SWITCH"]) {
          for (let j = 0; j < option.action["SWITCH"].length; j++) {
            const action = option.action["SWITCH"][j]
            if ((action as SwapAction).monster_id === (relevantTrainer as ITrainer).team.monsters.indexOf(item)) {
              relAction = action
              turnchar = option;
              HasAction = true;
            }
          }
        }
      }
    }

    return (
      <div >
        <TrainerMonster manager={Manager} item={item} key={stateKey} trainer={relevantTrainer} displayaction={HasAction} position={position} turn={turnchar} action={relAction}/>
      </div>
    )
  }
  
  return (
    <div className="baseBorder" key={stateKey}>
      {relevantTrainer != null &&
        <div>
        <div className="row">
          <div style={{justifyContent:"center"}}>
              <Carousel responsive={responsive} centerMode={true} className="imagecarouseldisplay" swipeable={true} infinite={true}>
                  {(relevantTrainer as ITrainer).team.items.map(_item => 
                    <div className="" style={{margin:"1rem"}}>
                      {ShowItemOption(_item)}
                    </div>
                  )}
              </Carousel>
          </div>          
        </div>
        <div className="row">
          <br/>
        </div>
        <div className="row">
          <div style={{justifyContent:"center"}}>
              <Carousel responsive={responsive} centerMode={true} className="imagecarouseldisplay" swipeable={true} infinite={true}>
                  {(relevantTrainer as ITrainer).team.monsters.map(_item => 
                    <div className="" style={{margin:"1rem"}}>
                      {ShowMonsterOption(_item)}
                    </div>
                  )}
              </Carousel>
          </div>          
        </div>
        </div>
      }
    </div>
  );
}

export default TrainerInfoDisplay;
