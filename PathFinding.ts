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
    export function attachSprite(pathfinder: PathFinder, sprite: Sprite, speed: number): void {
        pathfinder.attachSprite(sprite, speed);
    }

    //% block
    export function pathfind(pathfinder: PathFinder, target: Sprite) {
        pathfinder.updatePathfinding(target);
    }

    //% block
    export function pathfinderSpriteMoved(pathfinder: PathFinder) {
        pathfinder.followTarget.setPosition(pathfinder.sprite.x, pathfinder.sprite.y);
    }
}
