import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import logo from '../resources/images/npm install socket.io-client.svg';
import '../resources/styles/App.css';
import * as io from "socket.io-client";
import { useEffect, useState } from "react";
import { SocketManager } from '../classes/connection/SocketManager';

const HomePage = (props: any) => {

  // Build method for manager
  const receiveMessage = (data : any) => {
    setMessageReceived(data.message);
  }

  // Handle Manager
  const SocketManager: SocketManager = props.socket;
  SocketManager.MessageReceiver = receiveMessage;

  // Messages States
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");

  // Functions
  const joinRoom = () => {
    SocketManager.JoinRoom();
  };

  const sendMessage = () => {
    SocketManager.SendMessage( message );
  };

  const setRoomVal = (e : any) => {
    SocketManager.Room = e;
  }
  
  // DOM Return
  return (
    <div className="App">
      <input
        placeholder="Room Number..."
        onChange={(event) => {
          setRoomVal(event.target.value);
        }}
      />
      <button onClick={joinRoom}> Join Room</button>
      <input
        placeholder="Message..."
        onChange={(event) => {
          setMessage(event.target.value);
        }}
      />
      <button onClick={sendMessage}> Send Message</button>
      <h1> Message:</h1>
      {messageReceived}
    </div>
  );
}

export default HomePage;
