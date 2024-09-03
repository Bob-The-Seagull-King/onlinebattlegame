import React, { useState } from 'react';

// Package Imports
import 'bootstrap/dist/css/bootstrap.css';
import Dropdown from 'react-bootstrap/Dropdown';

// Class Imports
import { PlayManager } from '../../../classes/viewmodel/play_manager';
import { ManagerStore } from '../../../classes/viewmodel/manager_store_static';

// Components
import TextInput from '../../SubComponents/Inputs/TextInput';

// Style Components
import '../../../resources/styles/App.css';
import '../../../resources/styles/CustomStyleHost.scss'
import TeamPreview from '../../Components/Previews/TeamPreview';

const UserInfoDisplay = (props: any) => { 
    // Prop Intialisation
    const User : PlayManager = props.user;

    // Set States
    const [_allteams, returnallteams] = useState(User.TeamList);    
    const [_teamposition, returnteamposition] = useState(User.TeamCurr);

    function UpdateUsername(_name : string) {
        if (_name.trim().length > 0) {
            User.UserName = _name;
            ManagerStore.SetUserInformation(User);
        }
    }

    function UpdateTeamCurr(_index : number) {
        // Update User Details
        User.TeamCurr = _index;
        ManagerStore.SetUserInformation(User);

        // Update States
        returnallteams(User.TeamList);
        returnteamposition(User.TeamCurr);
    }
 
    return (
        <div>
            <TextInput inputname={"Display Name"} textvalue={User.UserName} updatemethod={UpdateUsername}/>

            <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic" style={{width:"100%"}}>
                    <TeamPreview user={User} team={_allteams[_teamposition]} />
                </Dropdown.Toggle>

                <Dropdown.Menu style={{width:"100%"}}>
                    {_allteams.map(item => (
                        <Dropdown.Item onClick={() => UpdateTeamCurr(_allteams.indexOf(item))} key={"TeamSelectDropdown" + _allteams.indexOf(item)}>
                            <TeamPreview user={User} team={item} />
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        </div>
    )
}

export default UserInfoDisplay