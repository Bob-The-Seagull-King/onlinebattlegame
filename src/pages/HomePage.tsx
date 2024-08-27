import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import '../resources/styles/App.css';
import '../resources/styles/CustomStyleHost.scss'
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";

const HomePage = (props: any) => {
 
  // Setup page navigation
  const navigate = useNavigate();

  // Redirect to another web page
  function NavigateAround(dir: string) { navigate('/' + dir); }
  
  return (   
    <div className="TestWebBody">
      <div className="row">
        <div className="col-6">
          {/** Enter online test page */}
          <Button bsPrefix="TestButton MedText" onClick={() => NavigateAround("online")} size="lg">Online Play</Button>
        </div>
        <div className="col-6">
          {/** Enter offline test page */}
          <Button bsPrefix="TestButton MedText" onClick={() => NavigateAround("offline")} size="lg">Offline Play</Button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
