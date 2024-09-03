import { Team } from "../sim/models/team";

class PlayManager {

    UserName : string;
    TeamList : Team[];

    constructor() {
        this.TeamList = [];
        this.UserName = "PLACEHOLDER"
    }

}

export {PlayManager};