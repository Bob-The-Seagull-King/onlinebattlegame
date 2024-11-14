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
import { ActionAction, ItemAction, MoveAction, PlaceAction, SwapAction } from '../../global_types';
import TrainerItem from '../Components/Options/TrainerItem';
import { IActiveMonster } from '../../classes/sim/models/active_monster';
import TrainerMonster from '../Components/Options/TrainerMonster';
import { IFieldedMonster } from '../../classes/sim/models/team';
import { IActiveAction } from '../../classes/sim/models/active_action';
import MonsterMove from '../Components/Options/MonsterMove';
import MonsterWalk from '../Components/Options/MonsterWalk';

const MonsterInfoDisplay = (props: any) => {
  const Manager : BattleManager = props.manager; // The manager running this battle
 
  // Collection of options available for the user to choose from
  const [gameState, setGameState] = useState(Manager.BattleState);
  const [relevantMonsters, setRelevantMonsters] = useState(GetRelevantMonsters());
  const [relevantTrainer, setRelevantTrainer] = useState(GetRelevantTrainer());
  const [stateKey, setStateKey] = useState(0);
  const [optionsReceived, setOptionsReceived] = useState(Manager.ChoicesLog);  

  // Update the state of options to match the manager
  const receiveState = () => {
    setGameState(Manager.BattleState);
    setStateKey(stateKey + 1)
    setRelevantMonsters(GetRelevantMonsters());
    setRelevantTrainer(GetRelevantTrainer());
  }

  
  function GetRelevantTrainer() {
    let returnVal = null;
    Manager.BattleState.sides.forEach(_side => {
      _side.trainers.forEach(_trainer => {
        if ((_trainer.sidepos === Manager.BattlePosition)) {
          returnVal = _trainer;
        }
      })
    })
    return returnVal
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

  function GetRelevantMonsters() {
    let returnVal = [];

    Manager.BattleState.sides.forEach(_side => {
      _side.trainers.forEach(_trainer => {
        if ((_trainer.sidepos === Manager.BattlePosition)) {
          _trainer.team.active.forEach(_active => {
            returnVal.push(_active);
          })
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

  function ShowMoveOption(item : IActiveAction, pos : number, monster : IFieldedMonster) {

    let position = -1;
    let turnchar = null;
    let relAction = null;

    let HasAction = false;

    console.log(optionsReceived)

    for(let i = 0; i < optionsReceived.length; i++) {
      const option = optionsReceived[i];
      if (option.pos === pos) {        
        if (option.action["ACTION"]) {
          for (let j = 0; j < option.action["ACTION"].length; j++) {
            const action = option.action["ACTION"][j]
            if ((action as ActionAction).action_id === (relevantTrainer as ITrainer).team.monsters[pos].actions_cur.indexOf(item)) {
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
        <MonsterMove manager={Manager} item={item} key={stateKey} displayaction={HasAction} position={pos} turn={turnchar} action={relAction}/>
      </div>
    )
  }

  function ShowWalkOption(pos : number, monster : IFieldedMonster) {

    let position = -1;
    let turnchar = null;
    let relAction = null;

    let HasAction = false;

    for(let i = 0; i < optionsReceived.length; i++) {
      const option = optionsReceived[i];
      if (option.pos === pos) {        
        if (option.action["MOVE"]) {
          for (let j = 0; j < option.action["MOVE"].length; j++) {
            const action = option.action["MOVE"][j]
            if ((action as MoveAction).paths.length > 0) {
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
        <MonsterWalk manager={Manager} key={stateKey} displayaction={HasAction} position={pos} turn={turnchar} action={relAction}/>
      </div>
    )
  }


  function ShowMonster(_monster : IFieldedMonster) {

    let MonsterFound = null;
    let MonsterVal = null;
    

    Manager.BattleState.sides.forEach(_side => {
      _side.trainers.forEach(_trainer => {
        if ((_trainer.sidepos === Manager.BattlePosition)) {
          MonsterFound = _trainer.team.monsters[_monster.monster]
          MonsterVal = _monster.monster;
        }
      })
    })

    return (
        <div className="baseBorder" >
          <div className='MedText'>
            {((_monster.hasactivated === false) ) &&
              <TextWobble value={(MonsterFound as IActiveMonster).nickname} />
            }
            {(_monster.hasactivated === true) &&
              <div>{(MonsterFound as IActiveMonster).nickname}</div>
            }
            </div>
            <div style={{justifyContent:"center"}}>
                <Carousel responsive={responsive} centerMode={true} className="imagecarouseldisplay" swipeable={true} infinite={true}>
                    {(MonsterFound as IActiveMonster).actions_cur.map(_item => 
                      <div className="" style={{margin:"1rem"}}>
                        {ShowMoveOption(_item, MonsterVal, _monster)}
                      </div>
                    )}
                    <div className="" style={{margin:"1rem"}}>
                      {ShowWalkOption(MonsterVal, _monster)}
                    </div>
                </Carousel>
            </div>   
        </div>
    )
  }
  
  return (
    <div key={stateKey}>
      {relevantMonsters != null &&
        <div>
        <div className="row">
          {relevantMonsters.map(monster => 
          <>
          <br style={{marginTop:"1rem"}}/>
          <div className="previewborder">
             {ShowMonster(monster)}
           </div> 
           </>
          )}                 
        </div>
        </div>
      }
    </div>
  );
}

export default MonsterInfoDisplay;
