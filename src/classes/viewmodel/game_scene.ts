import { ChosenAction, MessageSet, SelectedAction, TurnChoices, TurnSelect } from "../../global_types";
import { IBattle } from "../sim/controller/battle";
import { IScene } from "../sim/models/terrain/terrain_scene";
import { MessageTranslator } from "../tools/translator";

/**
 * Battle Manager interface, currently empty
 * and used to parent related interfaces.
 */
interface IGameScene {
}

class GameScene {

    public Scene : IScene;
    public IsActive : boolean;
    public TurnVal : ChosenAction;

    public funcUpdateVals   : any;

    /**
     * Simple constructor
     */
    constructor(_scene : IScene) {
        this.Scene = _scene
        this.IsActive = false;
        this.TurnVal = null;
    }    

    /**
     * Set the current state of the scene display
     * @param _active if the scene is active
     * @param _turn what turn, if any, should be returned
     */
    public setClickableState(_active : boolean, _turn : ChosenAction) {
        this.IsActive = _active;
        this.TurnVal = _turn;
        this.funcUpdateVals();
    }

    /**
     * Set the function for this manager to
     * trigger the scene update
     * @param updateresults the react component function
     */
    public setUpdateFuncs(updateresults : any) {
        this.funcUpdateVals = updateresults;
    }

}

export {GameScene, IGameScene}