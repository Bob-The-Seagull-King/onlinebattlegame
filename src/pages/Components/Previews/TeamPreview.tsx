import React from 'react';

// Package Imports
import 'bootstrap/dist/css/bootstrap.css';

// Class Imports
import { PlayManager } from '../../../classes/viewmodel/play_manager';
import { ManagerStore } from '../../../classes/viewmodel/manager_store_static';
import { Team } from '../../../classes/sim/models/team';

// Style Components
import '../../../resources/styles/App.css';
import '../../../resources/styles/CustomStyleHost.scss'


const TeamPreview = (props: any) => { 
    // Prop Intialisation
    const User : PlayManager = props.user;
    const Current : Team = props.team;

    return (
        <div>
            <div>
                {Current.Monsters.toString()}
            </div>
            <div>
                {Current.Items.toString()}
            </div>
            <div>
                {Current.Leads.toString()}
            </div>
        </div>
    )
}

export default TeamPreview