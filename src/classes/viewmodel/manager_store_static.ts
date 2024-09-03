import { PlayManager } from "./play_manager";

class ManagerStore {

    public static ReturnUserInformation() : PlayManager {        
        const data = localStorage.getItem('starpoweruser'); 
        
        if (data !== null) {
            try {
                const User : PlayManager = (JSON.parse(data) as PlayManager)
                return User;
            } catch (e) { undefined; }
        }

        const User : PlayManager = new PlayManager();
        return User;        
    }

    public static SetUserInformation(_user : PlayManager) {        
        localStorage.setItem('starpoweruser', JSON.stringify(_user));
    }

}

export {ManagerStore};