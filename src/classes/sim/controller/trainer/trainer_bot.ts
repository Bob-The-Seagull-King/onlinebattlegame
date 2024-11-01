import { BaseBotOptions, BotBehaviourWeight, BotOptions, ChosenAction, IDEntry, MoveAction, SelectedAction, TargetAction, TurnChoices, TurnSelect, TurnSelectReturn } from "../../../../global_types";
import { BattleSide } from "../../models/battle_side";
import { Battle } from "../battle";
import { ITrainer, TrainerBase } from "./trainer_basic";

/**
 * Interface of non-human trainers
 */
class ITrainerBot extends ITrainer {
    behaviour: IDEntry[] // Array of IDs for the behaviour a trainer will use to select actions
}

class TrainerBot extends TrainerBase {

    public Behaviour : IDEntry[] // Array of IDs for the behaviour a trainer will use to select actions

    /**
     * Simple constructor
     * @param _trainer The interface representing the trainer
     */
    constructor(_trainer : ITrainerBot, _owner : BattleSide) {
        super(_trainer, _owner)
        this.Behaviour = _trainer.behaviour;
    }
    
    /**
     * Given an array of possible options for a trainer to take (per active monster)
     * run behaviour events to determine the options that will be selected and return it.
     * @param _options The possible options a trainer can take this turn
     * @returns Returns a SelectedAction object describing what action(s) the trainer takes this turn
     */
    public async SelectChoice(_options: TurnSelect, _room : any, _battle : Battle) {
        
        const BaseOptions = await this.GenerateBasicWeightedArray(_options, _battle);
        const FullOptions = await this.ConvertBaseOptionsToWeightedArray(BaseOptions, _battle);

        const FinalOption = await this.SelectedMoveWeighted(FullOptions, _battle)

        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
        await delay(500);

        if (FinalOption) {
            return FinalOption.chosen;
        }
    }

    /**
     */
    public async GenerateBasicWeightedArray(_choices : TurnSelect, _battle : Battle) {
        const _botoptions : BaseBotOptions = [];

        for (let i = 0; i < _choices.Options.length; i++) {
            const relevantChoice = _choices.Options[i];
            const OptionsList = Object.keys(relevantChoice.Choices)
            for (let j = 0; j < OptionsList.length; j++) {
                const relevantKey = OptionsList[j]
                let BaseMod = 1000;
                BaseMod = await _battle.runBehaviour('GetBase'+relevantKey+"Chance", this, null, null, null, null, null, BaseMod, null);
                _botoptions.push(
                {
                    actions : relevantChoice.Choices[relevantKey],  // The action associated with this weighting
                    weight  : BaseMod,
                    charpos : i,
                    type    : relevantKey as 'SWITCH' | 'ITEM' | 'ACTION' | 'NONE' | 'MOVE' | 'PLACE'
                }
                )
            }
        }

        return _botoptions;
    }

    /**
     * Given a choice representing a SubSelectAction,
     * create an array of weighted options for each sub option.
     * @param _choices the sub options to give weights to
     * @param _base the action these options are a part of
     * @param _battle the battle the bot is a part of
     * @returns array of weighted options (BotOptions)
     */
    public async ConvertBaseOptionsToWeightedArray(_choices : BaseBotOptions, _battle : Battle) {
        const _botoptions : BotOptions = [];


        for (let i = 0; i < _choices.length; i++) {
            const RelevantChoice = _choices[i]
            for (let j = 0; j < RelevantChoice.actions.length; j++) {
                const RelevantAction = RelevantChoice.actions[j]

                let BaseMod = RelevantChoice.weight / await _battle.runBehaviour('GetRatio'+RelevantChoice.type+"Chance", this, null, RelevantChoice, null, null, RelevantAction, RelevantChoice.actions.length, RelevantAction);
                BaseMod = await _battle.runBehaviour('GetSpecific'+RelevantChoice.type+"Chance", this, null, RelevantChoice, null, null, null, BaseMod, RelevantAction);
                
                if ((RelevantAction.type === "ACTION") || (RelevantAction.type === "ITEM") || (RelevantAction.type === "SWITCH") || (RelevantAction.type === "PLACE")) {
                    for (let k = 0; k < (RelevantAction as TargetAction).target_id.length; k++) {
                        const RelevantSubAction = (RelevantAction as TargetAction).target_id[k];
                        
                        let EndMod = BaseMod / await _battle.runBehaviour('GetFinalRatio'+RelevantChoice.type+"Chance", this, null, RelevantChoice, null, null, RelevantAction, (RelevantAction as TargetAction).target_id.length, RelevantSubAction);
                        EndMod = await _battle.runBehaviour('GetFinalSpecific'+RelevantChoice.type+"Chance", this, null, RelevantChoice, null, null, RelevantAction, EndMod, RelevantSubAction);
                        
                        const newOption : BotBehaviourWeight = { action : RelevantAction, weight : EndMod, chosen: {
                            type: RelevantChoice.type,
                            hypo_index: RelevantChoice.charpos,
                            type_index: j,
                            hype_index: k
                        } }

                        _botoptions.push(newOption)
                    }
                } else if (RelevantAction.type === "MOVE") {
                    for (let k = 0; k < (RelevantAction as MoveAction).paths.length; k++) {
                        const RelevantSubAction = (RelevantAction as MoveAction).paths[k];
                        
                        let EndMod = BaseMod / await _battle.runBehaviour('GetFinalRatio'+RelevantChoice.type+"Chance", this, null, RelevantChoice, null, null, RelevantAction, (RelevantAction as MoveAction).paths.length, RelevantSubAction);
                        EndMod = await _battle.runBehaviour('GetFinalSpecific'+RelevantChoice.type+"Chance", this, null, RelevantChoice, null, null, RelevantAction, EndMod, RelevantSubAction);
                        
                        const newOption : BotBehaviourWeight = { action : RelevantAction, weight : EndMod, chosen: {
                            type: RelevantChoice.type,
                            hypo_index: RelevantChoice.charpos,
                            type_index: j,
                            hype_index: k
                        } }

                        _botoptions.push(newOption)
                    }
                }
            }
        }

        return _botoptions;
    }

    /**
     * Given an array of actions with specific weights,
     * randomly choose from the array - with higher priority
     * given to options with higher weight.
     * @param options the options to choose from
     * @param _battle the battle this bot is a part of
     * @returns the final BotOption being selected
     */
    public async SelectedMoveWeighted(options : BotOptions, _battle : Battle): Promise<BotBehaviourWeight> {
        
        const culledOptions = await _battle.runBehaviour('CullOptions', this, null, null, options, null, null, options);
        const totalWeight = culledOptions.reduce((sum, culledOptions) => sum + culledOptions.weight, 0);


        // Generate a random number between 0 and totalWeight
        const randomWeight = Math.random() * totalWeight;

        // Iterate over the items to find the one that corresponds to the random weight
        let ChosenItem : BotBehaviourWeight;
        let cumulativeWeight = 0;
        for (const item of culledOptions) {
            cumulativeWeight += item.weight;
            console.log(cumulativeWeight)
            if (randomWeight < cumulativeWeight) {
                ChosenItem = item;
                break;
            }
        }

        return ChosenItem;
        // Emergency return
        //const noneoption : BotBehaviourWeight = {action: {type: "NONE"}, weight: 1}
        //return noneoption
    }

}

export {TrainerBot, ITrainerBot}