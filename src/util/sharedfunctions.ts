import { IBattle } from "../classes/sim/controller/battle";
import { ChoiceTarget } from "../global_types";

export function returnChoiceTargetPlots(battle : IBattle, _battleItem : ChoiceTarget, startPos : number[], monsterPos? : number[]) {
    const array : number[][] = []

    const width = battle.scene.width - 1;
    const height = battle.scene.height - 1;

    array.push(startPos)

    if (monsterPos) {
        undefined // Use when considering MOVES
    }

    if ((_battleItem.target_pos === "SMALL") || 
        (_battleItem.target_pos === "MEDIUM") || 
        (_battleItem.target_pos === "LARGE")) {
            if (startPos[0] > 0) {array.push([startPos[0] - 1, startPos[1]])}
            if (startPos[1] > 0) {array.push([startPos[0], startPos[1]-1])}
            if (startPos[0] < height) {array.push([startPos[0] + 1, startPos[1]])}
            if (startPos[1] < width) {array.push([startPos[0], startPos[1] + 1])}
    }

    if ((_battleItem.target_pos === "MEDIUM") || 
        (_battleItem.target_pos === "LARGE")) {
            if ((startPos[1] > 0) && (startPos[0] > 0)) {array.push([startPos[0]-1, startPos[1]-1])}
            if ((startPos[1] > 0) && (startPos[0] < height)) {array.push([startPos[0]+1, startPos[1]-1])}
            if ((startPos[1] < width) && (startPos[0] > 0)) {array.push([startPos[0]-1, startPos[1]+1])}
            if ((startPos[1] < width) && (startPos[0] < height)) {array.push([startPos[0]+1, startPos[1]+1])}
    }

    if ((_battleItem.target_pos === "LARGE")) {
            if (startPos[0] > 1) {array.push([startPos[0] - 2, startPos[1]])}
            if (startPos[1] > 1) {array.push([startPos[0], startPos[1]-2])}
            if (startPos[0] < height-1) {array.push([startPos[0] + 2, startPos[1]])}
            if (startPos[1] < width-1) {array.push([startPos[0], startPos[1] + 2])}
    }

    return array;
}