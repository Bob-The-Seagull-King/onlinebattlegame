import { PlayManager, IPlayManager } from "./play_manager";

class ManagerStore {

    public static ReturnUserInformation() : PlayManager {        
        const data = localStorage.getItem('starpoweruser'); 
        
        if (data !== null) {
            try {
                const Interface : IPlayManager = JSON.parse(data) as IPlayManager
                const User : PlayManager = new PlayManager(Interface)
                return User;
            } catch (e) { undefined; }
        }

        const User : PlayManager = new PlayManager({username: "Placeholder", teamcurr: 0, teamlist: []});
        User.TempAddTeam();     // Temporary - used for testing
        User.TempAddTeam2();    // Temporary - used for testing
        return User;        
    }

    public static SetUserInformation(_user : PlayManager) {        
        localStorage.setItem('starpoweruser', JSON.stringify(_user.ConvertToInterface()));
    }

}

export {ManagerStore};