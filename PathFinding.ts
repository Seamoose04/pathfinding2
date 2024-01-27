/**
* Custom blocks
*/

//% color=#6ea2ba icon="→"
namespace pathfinder {
    //% block
    export function createPathfinder(map: tiles.TileMapData, followTargetIMG: Image): PathFinder {
        return new PathFinder(map, followTargetIMG);
    }

    //% block
    export function attachSprite(pathfinder: PathFinder, sprite: Sprite): void {
        pathfinder.attachSprite(sprite);
    }

    //% block
    export function pathfind(pathfinder: PathFinder, target: Sprite) {
        pathfinder.updatePathfinding(target);
    }
}
