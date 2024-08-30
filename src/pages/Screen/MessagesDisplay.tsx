import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import '../../resources/styles/App.css';
import { useState } from "react";
import { BattleManager } from '../../classes/viewmodel/battle_manager';

const MessagesDisplay = (props: any) => {
  const Manager : BattleManager = props.manager; // The manager running this battle
  
  // Collection of messages to displpay
  const [messageReceived, setMessageReceived] = useState([]);
  
  // Update the state of messages to match the manager
  const receiveMessage = () => {
    const CurrentMessages =  Object.assign([], Manager.TranslatedLog);
    setMessageReceived(CurrentMessages);
  }
  
  // Assign the relevant function to the manager
  Manager.setResultFuncs(receiveMessage)
  
  return (
    <div>
      <h1 className="BigText"> BATTLE MESSAGES</h1>
      
      <div className="BasicElementContainer overflow-auto flex-grow-1">
        <div className="ForceHeight50">
            {/** Display each message in human readable format */}
            {messageReceived.map(item => (
              <p key={"messageofset"+messageReceived.indexOf(item)}> {item} </p>))}
          </div>
      </div>
    </div>
  );
}

export default MessagesDisplay;
