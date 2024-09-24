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
    const CurrentMessages =  Object.assign([], Manager.MessageLog);
    setMessageReceived(CurrentMessages);
  }
  
  // Assign the relevant function to the manager
  Manager.setResultFuncs(receiveMessage)
  
  return (
    <div>      
      <div className="BasicElementContainer overflow-auto flex-grow-1">
        <div className="ForceHeight15">
            {/** Display each message in human readable format */}
            {messageReceived.map(item => (
              <div key={"messageset"+messageReceived.indexOf(item)}>
                {Manager.TranslateMessages(item).map(element => (
                  <p key={"messageofset"+messageReceived.indexOf(item)+(element)}> {element} </p> ))}
              </div> ))}
          </div>
      </div>
    </div>
  );
}

export default MessagesDisplay;
