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

    type CustomToggleProps = {
        children?: React.ReactNode;
        onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {};
      };

      const CustomToggle = React.forwardRef(
        (props: CustomToggleProps, ref: React.Ref<HTMLAnchorElement>) => (
          <a
            href=""
            ref={ref}
            onClick={e => {
              e.preventDefault();
              props.onClick(e);
            }}
          >
                    <TeamPreview user={User} team={_allteams[_teamposition]} />
          </a>
        )
      );
 
    return (
        <div>
            <TextInput inputname={"Display Name"} textvalue={User.UserName} updatemethod={UpdateUsername}/>

            <Dropdown>
                <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                    Custom toggle
                </Dropdown.Toggle>

                <Dropdown.Menu style={{width:"100%",padding:"0%"}} className="previewborder">
                    {_allteams.map(item => (
                        <Dropdown.Item key={"TeamSelectDropdown" + _allteams.indexOf(item)} onClick={() => UpdateTeamCurr(_allteams.indexOf(item))} style={{padding:"1em",margin:"0%",borderRadius:"0.5em"}}>
                            <TeamPreview user={User} team={item}  /> 
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        </div>
    )
}

export default UserInfoDisplay