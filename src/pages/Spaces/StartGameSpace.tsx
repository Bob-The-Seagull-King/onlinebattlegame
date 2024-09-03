import React from 'react';

// Package Imports
import 'bootstrap/dist/css/bootstrap.css';
import Stack from 'react-bootstrap/Stack';

// Class Imports
import { PlayManager } from '../../classes/viewmodel/play_manager';

// Components
import TeamManagerDisplay from '../Screen/StartGame/TeamManagerDisplay';
import UserInfoDisplay from '../Screen/StartGame/UserInfoDisplay';
import BeginPlayDisplay from '../Screen/StartGame/BeginPlayDisplay';

// Style Components
import '../../resources/styles/App.css';
import '../../resources/styles/CustomStyleHost.scss'

const StartGameSpace = (props: any) => {    
    // Prop Intialisation
    const User : PlayManager = props.user;

    return (
        <div className="GamePadding">
            <div className="row gy-4">
                {/* Team Builder Side */}
                <div className="col-sm-6 col-12">
                    <div className="BasicElementContainer overflow-auto flex-grow-1">
                        <div className="ForceHeight90">
                            <TeamManagerDisplay user={User}/>
                        </div>
                    </div>
                </div>
                <div className="col-sm-6 col-12">
                    <Stack gap={4} style={{height: "100%"}}>
                        {/* User Info */}
                        <div className="flex-grow-1">
                            <div>
                                <UserInfoDisplay user={User}/>
                            </div>
                        </div>
                        {/* Begin Play */}
                        <div className="BasicElementContainer overflow-auto flex-grow-1">
                            <div className="ForceHeight30">
                                <BeginPlayDisplay user={User}/>
                            </div>
                        </div>   
                    </Stack>
                </div>
            </div>
        </div>
    )
}

export default StartGameSpace