import React from 'react';


// Package Imports
import 'bootstrap/dist/css/bootstrap.css';
import Image from 'react-bootstrap/Image';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBriefcase, faChessKnight, faStar, faStarHalf  } from '@fortawesome/free-solid-svg-icons'

// Class Imports
import { PlayManager } from '../../../classes/viewmodel/play_manager';
import { ManagerStore } from '../../../classes/viewmodel/manager_store_static';
import { Team } from '../../../classes/sim/models/team';

// Style Components
import '../../../resources/styles/App.css';
import '../../../resources/styles/CustomStyleHost.scss'
import { ActiveItem } from '../../../classes/sim/models/active_item';
import { ActiveMonster } from '../../../classes/sim/models/active_monster';


const TeamPreview = (props: any) => { 
    // Prop Intialisation
    const User : PlayManager = props.user;
    const Current : Team = props.team;

    function returnName() {
        return (
            <div className="row">

                <div className="col-6 d-flex align-items-center justify-content-center">
                    <div className="MedTextWhite">
                        {Current.Name}
                    </div>
                    
                </div>
            
                <div className="col-6" style={{paddingLeft:"0.5em",paddingRight:"0.5em"}}>
                    <div className="row">
                        {returnStarPower()}
                    </div>
                </div>
            </div>
        )
    }

    function returnStar(_index : number) {
        const SP = Current.CalculateStarPower();
        if (SP >= ((200*_index)+199)) {
            return ( <FontAwesomeIcon icon={faStar} /> )
        } else if (SP >= ((200*_index)+99)) {
            return ( <FontAwesomeIcon icon={faStarHalf} /> )
        } else { return ( <></> ) }        
    }

    function returnStarPower() {
        return (            
            <div className="col-12 d-flex align-items-center justify-content-center">
                <div className="col-2 starpower"> {returnStar(0)} </div>
                <div className="col-2 starpower"> {returnStar(1)} </div>
                <div className="col-2 starpower"> {returnStar(2)} </div>
                <div className="col-2 starpower"> {returnStar(3)} </div>
                <div className="col-2 starpower"> {returnStar(4)} </div>
                <div className="col-2 starpower"> {returnStar(5)} </div>
            </div>
        )
    }

    function returnItemAddress(_item : ActiveItem): string {        
        return "/assets/img_item/default/img_000_0.png";
    }

    function returnMonsterAddress(_item : ActiveMonster): string {        
        return "/assets/img_monster/default/img_000_3.png";
    }

    function returnBag() {
        return (
            <div className="col-12">
                <div className='row'>
                    <div className="col-1 d-flex align-items-center justify-content-center LargeIcon">
                        <FontAwesomeIcon icon={faBriefcase} />
                    </div>
                    <div className="col-11 d-flex align-items-center">
                        {Current.Items.map(item => 
                            <Image className="miniImage" src={returnItemAddress(item)} fluid />                        
                        )}
                    </div>
                </div>
            </div>
        )
    }

    function returnTeam() {
        return (
            <div className="col-12">
                <div className='row'>
                    <div className="col-1 d-flex align-items-center justify-content-center LargeIcon">
                        <FontAwesomeIcon icon={faChessKnight} />
                    </div>
                    <div className="col-11 d-flex align-items-center">
                        {Current.Monsters.map(item => 
                            <Image className="miniImage" src={returnMonsterAddress(item)} fluid />                        
                        )}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="previewborder">
            <div className="bluebackground">
                {returnName()}                
            </div>
            <div className="starpowerbackground">
                <div className="row" style={{marginBottom:"0.5em"}}>
                    {returnBag()}
                </div>
                <div className="row" style={{marginBottom:"0.5em"}}>
                    {returnTeam()}
                </div>
            </div>
        </div>
    )
}

export default TeamPreview