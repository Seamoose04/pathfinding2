class Vector2 {
    public x: number;
    public y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    static distance(start: Vector2, end: Vector2) {
        let xDist = end.x - start.x;
        let yDist = end.y - start.y;
        return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
    }
}
class Node {
    position: Vector2;
    parent: Node;
    G: number;
    constructor(position: Vector2, parent: Node) {
        this.position = position;
        this.parent = parent;
        if (this.parent) {
            this.G = this.parent.G + 1;
        }
    }
}
class NodeList {
    list: Array<Node>;
    constructor() {
        this.list = [];
    }
    add(node: Node) {
        this.list.push(node);
    }
    size() {
        return this.list.length;
    }
    get(index: number) {
        return this.list[index];
    }
    containsPosition(node: Vector2) {
        for (let i = 0; i < this.size(); i++) {
            if (this.list[i].position.x == node.x && this.list[i].position.y == node.y) {
                return this.list[i];
            }
        }
        return null;
    }
    removeElement(node: Node) {
        let index = this.list.indexOf(node);
        if (index != -1) {
            this.list.removeAt(index);
            return true;
        }
        return false;
    }
}
class PathFinder {
    origin: Node;
    sprite: Sprite;
    followTarget: Sprite;

    map: tiles.TileMapData;
    openList: NodeList;
    closedList: NodeList;

    speed: number;

    constructor(map: tiles.TileMapData) {
        this.map = map;
        this.followTarget = sprites.create(assets.image`targetIMG`);
        this.followTarget.setFlag(SpriteFlag.Invisible, true);
        this.followTarget.scale = 0.001;
    }

    attachSprite(sprite: Sprite, speed: number) {
        this.sprite = sprite;
        this.followTarget.setPosition(this.sprite.x, this.sprite.y);
        this.speed = speed;
        this.sprite.follow(this.followTarget, this.speed);
    }

    updatePathfinding(target: Sprite) {
        this.origin = new Node(new Vector2(this.sprite.tilemapLocation().col, this.sprite.tilemapLocation().row), null);
        this.origin.G = 0;
        if (Vector2.distance(new Vector2(this.followTarget.x, this.followTarget.y), new Vector2(this.sprite.x, this.sprite.y)) < this.speed/35) {
            let path = this.findPath(new Vector2(target.tilemapLocation().col, target.tilemapLocation().row));
            if (path && path.length > 0) {
                let next = path[path.length - 1];
                tiles.placeOnTile(this.followTarget, tiles.getTileLocation(next.x, next.y));
                if (Math.abs(this.sprite.x - this.followTarget.x) < this.speed / 35) {
                    this.sprite.vx = 0;
                }
                if (Math.abs(this.sprite.y - this.followTarget.y) < this.speed / 35) {
                    this.sprite.vy = 0;
                }
            }
        }
    }

    findPath(goal: Vector2) {
        let width = tileUtil.tilemapProperty(this.map, tileUtil.TilemapProperty.Columns);
        let height = tileUtil.tilemapProperty(this.map, tileUtil.TilemapProperty.Rows);
        this.openList = new NodeList();
        this.closedList = new NodeList();
        this.openList.add(this.origin);
        let offsets = [[1, 0], [-1, 0], [0, 1], [0, -1]];
        while (this.openList.size() > 0) {
            let currentSquare: Node;
            let lowestF = Infinity;
            for (let j = 0; j < this.openList.size(); j++) {
                let F = this.calculateF(this.openList.get(j), goal);
                if (F < lowestF) {
                    lowestF = F;
                    currentSquare = this.openList.get(j);
                }
            }
            this.openList.removeElement(currentSquare);
            this.closedList.add(currentSquare);
            for (let k = 0; k < offsets.length; k++) {
                let nodePos = new Vector2(currentSquare.position.x + offsets[k][0], currentSquare.position.y + offsets[k][1]);
                let closed = this.closedList.containsPosition(nodePos);
                if (this.getWalkable(nodePos) && !closed) {
                    let position = this.openList.containsPosition(nodePos);
                    if (position) {
                        if (currentSquare.G + 1 < position.G) {
                            position.parent = currentSquare;
                            position.G = currentSquare.G + 1;
                        }
                    } else {
                        this.openList.add(new Node(nodePos, currentSquare));
                    }
                }
            }
            let node = this.closedList.containsPosition(goal);
            if (node) {
                let path = [];
                while (node.parent) {
                    path.push(node.position);
                    node = node.parent;
                }
                return path;
            }
        }
        return null;
    }

    calculateF(node: Node, goal: Vector2) {
        let G = node.G;
        let H = Vector2.distance(node.position, goal);
        return G + H;
    }

    getWalkable(position: Vector2) {
        if (this.closedList.containsPosition(position)) {
            return false;
        }
        if (this.map.isWall(position.x, position.y)) {
            return false;
        }
        if (position.x < 0 || position.x >= tileUtil.tilemapProperty(this.map, tileUtil.TilemapProperty.Columns)) {
            return false;
        }
        if (position.y < 0 || position.y >= tileUtil.tilemapProperty(this.map, tileUtil.TilemapProperty.Rows)) {
            return false;
        }

        return true;
    }
}
