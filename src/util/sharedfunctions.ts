import { IBattle } from "../classes/sim/controller/battle";
import { ChoiceTarget } from "../global_types";

export function returnChoiceTargetPlots(battle : IBattle, _battleItem : ChoiceTarget, startPos : number[], monsterPos? : number[]) {
    const array : number[][] = []

    const width = battle.scene.width - 1;
    const height = battle.scene.height - 1;

    array.push(startPos)

    if (monsterPos && 
        _battleItem.target_fill && 
        ((_battleItem.target_direction === "BOTH") || 
        (_battleItem.target_direction === "CARDINAL") || 
        (_battleItem.target_direction === "ORTHOGONAL"))) {
        
        let verdistance = (-1 * (startPos[0] - monsterPos[0]))
        let hordistance = (1 * (startPos[1] - monsterPos[1]))

        if (hordistance === -0) {
            hordistance = 0;
        }
        if (verdistance === -0) {
            verdistance = 0;
        }


        let distance = _battleItem.target_range;

        if (_battleItem.target_fill === "MIN") {
            distance = Math.max(Math.abs(hordistance), Math.abs(verdistance))
        } else if (_battleItem.target_fill === "NONE") {
            distance = 0;
        }

        if (hordistance === 0) {            
            if (verdistance > 0) { // Line UP
                const FillArray = gatherLine(monsterPos, distance, 0, -1, width, height)
                array.push(...FillArray);
            } else if (verdistance < 0) { // Line DOWN
                const FillArray = gatherLine(monsterPos, distance, 0, 1, width, height)
                array.push(...FillArray);
            }
        } else if (hordistance > 0) {
            if (verdistance === 0) { // Line RIGHT
                const FillArray = gatherLine(monsterPos, distance, 1, 0, width, height)
                array.push(...FillArray);
            } else if (verdistance < 0) { // Diagonal SouthEast
                const FillArray = gatherLine(monsterPos, distance, 1, 1, width, height)
                array.push(...FillArray);
            } else if (verdistance > 0) { // Diagonal NorthEast
                const FillArray = gatherLine(monsterPos, distance, 1, -1, width, height)
                array.push(...FillArray);
            }
        } else if (hordistance < 0) {
            if (verdistance === 0) { // Line LEFT
                const FillArray = gatherLine(monsterPos, distance, -1, 0, width, height)
                array.push(...FillArray);
            } else if (verdistance < 0) { // Diagonal SouthWest
                const FillArray = gatherLine(monsterPos, distance, -1, 1, width, height)
                array.push(...FillArray);
            } else if (verdistance > 0) { // Diagonal NorthWest
                const FillArray = gatherLine(monsterPos, distance, -1, -1, width, height)
                array.push(...FillArray);                
            }
        }
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

    return removeDuplicates(array);
}

function gatherLine(startPos : number[], distance : number, vertical : number, horizontal : number, width : number, height: number) : number[][] {
    const linearray : number[][] = []

    for (let i = 1; i < distance+1; i ++) {
        const NewVal = [startPos[0] + (i * horizontal),startPos[1] + (i * vertical)]
        if ((NewVal[0] >= 0) && (NewVal[0] <= width) && (NewVal[1] >= 0) && (NewVal[1] <= height)) {
            linearray.push(NewVal)
        }
    }

    return linearray;
}

function removeDuplicates(arr: number[][]): number[][] {
    const uniqueArray = new Set<string>();

    // Add each inner array as a string to the Set
    for (const subArr of arr) {
        uniqueArray.add(JSON.stringify(subArr));
    }

    // Convert the Set back into an array of arrays
    return Array.from(uniqueArray).map(item => JSON.parse(item));
}