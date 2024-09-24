import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';

import '../../resources/styles/App.css';
import { useState } from "react";
import { BattleManager } from '../../classes/viewmodel/battle_manager';
import PlotsDisplay from './PlotsDisplay';
import TurnCharacterDisplay from '../Components/Options/TurnCharacter';

const OptionsDisplay = (props: any) => {
  const Manager : BattleManager = props.manager; // The manager running this battle
 
  // Collection of options available for the user to choose from
  const [optionsReceived, setOptionsReceived] = useState(Manager.ChoicesLog);
  
  // Update the state of options to match the manager
  const receiveOptions = () => {
    const options =  Object.assign([], Manager.ChoicesLog);
    setOptionsReceived(options);
  }

  // Assign the relevant function to the manager
  Manager.setOptionsFuncs(receiveOptions)
  
  return (
    <div className="row">
      <div className="col-6">
            <Tab.Container id="left-tabs-example" defaultActiveKey={(optionsReceived.length > 0)? optionsReceived[0].pos: 0}>
           
                  <Nav  variant="tabs" >
                    {optionsReceived.map(item => 
                      <Nav.Item >
                        <Nav.Link eventKey={item.pos}>{(item.pos < 0)? "TRAINER" : Manager.BattleState.sides[Manager.BattlePosition].trainers[Manager.SidePosition].team.monsters[item.pos].nickname}</Nav.Link>
                      </Nav.Item>
                    ) }
                  </Nav>
                  
                  <Tab.Content>
                    {optionsReceived.map(item => 
                        <Tab.Pane  eventKey={item.pos}>
                          <TurnCharacterDisplay manager={Manager} position={item.pos} turn={item}/>
                        </Tab.Pane>
                    ) }
                  </Tab.Content>
            </Tab.Container>
      </div>
      <div className="col-6">
        <PlotsDisplay  manager={Manager}/>
      </div>
    </div>
  );
}

export default OptionsDisplay;
