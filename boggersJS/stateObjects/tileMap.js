import Vector2 from "../common/vector2.js";

export default class TileMap {
    /** A 2D-grid of tiles. Handles tile-based collision for MovablePhysics objects. */

    #mapDimensions
    #unitDimensions
    #grid
    #sprites

    constructor(mapDimensions, unitDimensions, initialTiles, sprites) {
        this.#mapDimensions = mapDimensions;
        this.#unitDimensions = unitDimensions;
        this.#grid = Array.from({ length: Math.floor(mapDimensions.x / unitDimensions.x) }, () => 
                     Array.from({ length: Math.floor(mapDimensions.y / unitDimensions.y) }, () => 0));
        this.initializeGrid(initialTiles);
        this.#sprites = sprites;
    }

    initializeGrid(initialTiles) {
        for (let tile in initialTiles) {
            const [ i, j, value ] = initialTiles[tile];
            this.#grid[i][j] = value;
        }
    }

    toGridPos(realPos) { return realPos.floorDivCopy(this.#unitDimensions); }
    toRealPos(gridPos) { return gridPos.mulCopy(this.#unitDimensions); }

    collideTop(target, gridPos) {
        const realPos = this.toRealPos(gridPos);
        
        if (target.pos.y + target.dimensions.y > realPos.y &&
            target.oldPos.y + target.dimensions.y <= realPos.y) {
            target.pos = new Vector2(target.pos.x, realPos.y - target.dimensions.y);
            target.velocity = new Vector2(target.velocity.x, 0);
        }

    }

    callCollisionHandler(target) {
        const newPos = new Vector2(target.pos.x, target.pos.y + target.dimensions.y);
        const gridPos = this.toGridPos(newPos)
        switch (this.#grid[gridPos.x][gridPos.y]) {
            case 1:  return this.collideTop(target, gridPos);
            default: return;
        }
    }

    handleCollisions(target) {
        this.callCollisionHandler(target);
    }

    draw(context) {
        for (let i in this.#grid) {
            for (let j in this.#grid[i]) {
                if (!this.#grid[i][j])
                    continue;
                this.#sprites[this.#grid[i][j] - 1].draw(context, this.toRealPos(new Vector2(i, j)));
            }
        }
    }
}
