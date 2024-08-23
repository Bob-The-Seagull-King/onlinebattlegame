import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import logo from '../resources/images/npm install socket.io-client.svg';
import '../../resources/styles/App.css';
import * as io from "socket.io-client";
import { useEffect, useState } from "react";
import { SocketManager } from '../../classes/structure/connection/SocketManager';
import { OnlineBattleManager } from '../../classes/viewmodel/battle_manager_online';
import { OfflineBattleManager } from '../../classes/viewmodel/battle_manager_local';
import { BattleManager } from '../../classes/viewmodel/battle_manager';

const MessagesDisplay = (props: any) => {
  const Manager : BattleManager = props.manager;
  // Messages States
  const [messageReceived, setMessageReceived] = useState([]);
  
  const receiveMessage = () => {
    const CurrentMessages =  Object.assign([], Manager.MessageLog);
    setMessageReceived(CurrentMessages);
  }
  
  Manager.setResultFuncs(receiveMessage)
  
  // DOM Return
  return (
    <div className="">
      <h1 className="BigText"> BATTLE MESSAGES</h1>
      <div className="BasicElementContainer overflow-auto flex-grow-1">
        <div className="ForceHeight50">
            {messageReceived.map(item => (
              <div key={"messageset"+messageReceived.indexOf(item)}>
                <p>{"Message Set " + messageReceived.indexOf(item)}</p>
                {Manager.TranslateMessages(item).map(element => (
                  <p key={"messageofset"+messageReceived.indexOf(item)+(element)}>
                    {element}
                  </p>
                ))}
              </div>
            ))}
          </div>
      </div>
    </div>
  );
}

export default MessagesDisplay;
