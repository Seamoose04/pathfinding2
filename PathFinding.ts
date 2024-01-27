/**
* Custom blocks
*/

//% color=#6ea2ba icon="→"
namespace pathfinder {
    //% block
    export function createPathfinder(map: tiles.TileMapData): PathFinder {
        return new PathFinder(map);
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
