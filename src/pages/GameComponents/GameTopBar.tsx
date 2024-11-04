import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';

import '../../resources/styles/App.css';
import { useState } from "react";
import { BattleManager } from '../../classes/viewmodel/battle_manager';

const GameTopBar = (props: any) => {
  const Manager : BattleManager = props.manager; // The manager running this battle
 
  // Collection of options available for the user to choose from
  const [gameState, setGameState] = useState(Manager.BattleState);
  
  // Update the state of options to match the manager
  const receiveOptions = () => {
    setGameState(Manager.BattleState);
  }

  // Assign the relevant function to the manager
  Manager.setOptionsFuncs(receiveOptions)
  
  return (
    <div className="sticky-nav">
    </div>
  );
}

export default GameTopBar;
