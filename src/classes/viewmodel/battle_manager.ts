interface IBattleManager {
}

class BattleManager {

    public ReturnMessage : any;

    public setReturnFunc(_func : any) {
        this.ReturnMessage = _func;
    }

}

export {BattleManager, IBattleManager}