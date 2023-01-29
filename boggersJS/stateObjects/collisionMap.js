import { Vector2 } from '../common/index.js';
import { MovablePhysics } from '../components/index.js';

/** A 2D-grid that handles tile-based collision for MovablePhysics objects.
 * 
 *  Collision code is based on PothOnProgramming's tile tutorial. See the tutorial code at
 *  {@link https://github.com/pothonprogramming/pothonprogramming.github.io/blob/master/content/tile-types/tile-types.js TileTypes}. 
 *  @memberof StateObjects */
class CollisionMap {
    /** @type {Vector2} */
    #unitDimensions
    /** @type {Array<Array<number>>} */
    #grid
    /** @type {Vector2} */
    #mapDimensions

    /** Create the CollisionMap.
     *  @param {Vector2} unitDimensions - The dimensions of each tile.
     *  @param {Array<Array<number>>} grid - A 2D array where each number denotes the collision type of a tile. */
    constructor(unitDimensions, grid) {
        this.#unitDimensions = unitDimensions;
        this.#grid = grid;
        this.#mapDimensions = new Vector2(this.#grid[0].length * this.#unitDimensions.x, this.#grid.length * this.#unitDimensions.y);

        this.collideBottom = this.collideBottom.bind(this);
        this.collideRight = this.collideRight.bind(this);
    }

    /** Get the total dimensions of the map.
      * @return {Vector2} The dimensions of the map. */
    get mapDimensions() { return this.#mapDimensions.copy(); }

    /** Convert a real position to the grid position.
     *  @param {Vector2} realPos - The real position. 
     *  @return {Vector2} The grid position. */
    toGridPos(realPos) { return realPos.floorDivCopy(this.#unitDimensions); }

    /** Convert a grid position to the real position.
     * @param {Vector2} gridPos - The grid position.
     * @returns {Vector2} The real position. */
    toRealPos(gridPos) { return gridPos.mulCopy(this.#unitDimensions); }

    /** Handle collisions from the top and snap the Movable if needed.
     *  @param {MovablePhysics} target - The target Movable.
     *  @param {Vector2} tilePos - The real position for a tile that is being checked.
     *  @returns {boolean} Whether there is a collision. */
    collideTop(target, tilePos) {
        if (target.pos.y + target.dimensions.y <= tilePos.y || target.oldPos.y + target.dimensions.y > tilePos.y)
            return false;
        target.pos.y = tilePos.y - target.dimensions.y;
        target.velocity.y = 0;
        target.enableJump();
        return true;
    }

    /** Handle collisions from the bottom and snap the Movable if needed.
     *  @param {MovablePhysics} target - The target Movable.
     *  @param {Vector2} tilePos - The real position for a tile that is being checked.
     *  @returns {boolean} Whether there is a collision. */
    collideBottom(target, tilePos) {
        if (target.pos.y >= tilePos.y + this.#unitDimensions.y || target.oldPos.y < tilePos.y + this.#unitDimensions.y)
            return false;
        target.pos.y = tilePos.y + this.#unitDimensions.y;
        target.velocity.y = 0;
        return true;
    }

    /** Handle collisions from the left and snap the Movable if needed.
     *  @param {MovablePhysics} target - The target Movable.
     *  @param {Vector2} tilePos - The real position for a tile that is being checked.
     *  @returns {boolean} Whether there is a collision. */
    collideLeft(target, tilePos) {
        if (target.pos.x + target.dimensions.x <= tilePos.x || target.oldPos.x + target.dimensions.x > tilePos.x)
            return false;
        target.pos.x = tilePos.x - target.dimensions.x;
        target.velocity.x = 0;
        return true;
    }

    /** Handle collisions from the right and snap the Movable if needed.
     *  @param {MovablePhysics} target - The target Movable.
     *  @param {Vector2} tilePos - The real position for a tile that is being checked.
     *  @returns {boolean} Whether there is a collision. */
    collideRight(target, tilePos) {
        if (target.pos.x >= tilePos.x + this.#unitDimensions.x || target.oldPos.x < tilePos.x + this.#unitDimensions.x)
            return false;
        target.pos.x = tilePos.x + this.#unitDimensions.x;
        target.velocity.x = 0;
        return true;
    }

    /** Handle collisions for a slope rising from left to right and snap the Movable if needed.
     *  @param {MovablePhysics} target - The target Movable.
     *  @param {Vector2} tilePos - The real position for a tile that is being checked. */
    collideSlopeUp(target, tilePos) {
        const origin = tilePos.copy(); 
        origin.y += this.#unitDimensions.y;
        const difference = target.bottomRightPos.subCopy(origin);
        const crossProduct = -difference.x - difference.y;
        const oldDifference = target.oldBottomRightPos.subCopy(origin);
        const oldCrossProduct = -oldDifference.x - oldDifference.y;

        if (crossProduct < 1 && oldCrossProduct > -1) {
            target.pos.y = tilePos.y - target.dimensions.y - difference.x + this.#unitDimensions.y;
            target.velocity.y = 0;
            target.enableJump();
        }
    }

    /** Handle collisions for a slope descending from left to right and snap the Movable if needed.
     *  @param {MovablePhysics} target - The target Movable.
     *  @param {Vector2} tilePos - The real position for a tile that is being checked. */
    collideSlopeDown(target, tilePos) {
        const origin = tilePos.copy();
        const difference = target.bottomLeftPos.subCopy(origin);
        const crossProduct = difference.x - difference.y;
        const oldDifference = target.oldBottomLeftPos.subCopy(origin);
        const oldCrossProduct = oldDifference.x - oldDifference.y;

        if (crossProduct < 1 && oldCrossProduct > -1) {
            target.pos.y = tilePos.y - target.dimensions.y + difference.x;
            target.velocity.y = 0;
            target.enableJump();
        }
    }

    /** Check many collisions at once for a tile. Stops at the first collision it sees.
     *  @param {MovablePhysics} target - The target Movable.
     *  @param {Vector2} tilePos - The real position for a tile that is being checked.
     *  @param {Array<CallableFunction>} collideFuncs - A list of collision functions to run through. */
    collideMany(target, tilePos, collideFuncs) {
        for (let i in collideFuncs)
            if (collideFuncs[i](target, tilePos)) return;
    }

    /** Calls the appropiate collision handler based on the tile found at a target's corner.
     *  @param {MovablePhysics} target - The target Movable. 
     *  @param {Vector2} cornerPos - A corner of the target Movable to check. */
    callCollisionHandler(target, cornerPos) {
        const gridPos = this.toGridPos(cornerPos);
        const tilePos = this.toRealPos(gridPos);
        switch (this.#grid[Math.min(this.#grid.length - 1, gridPos.y)][Math.min(this.#grid[0].length - 1, gridPos.x)]) {
            case "^^^": return this.collideTop(target, tilePos);
            case "___": return this.collideBottom(target, tilePos);
            case "|  ": return this.collideLeft(target, tilePos);
            case "  |": return this.collideRight(target, tilePos);
            case "===": return this.collideMany(target, tilePos, [this.collideTop, this.collideBottom]);
            case "|^^": return this.collideMany(target, tilePos, [this.collideTop, this.collideLeft]);
            case "^^|": return this.collideMany(target, tilePos, [this.collideTop, this.collideRight]);
            case "|__": return this.collideMany(target, tilePos, [this.collideBottom, this.collideLeft]);
            case "__|": return this.collideMany(target, tilePos, [this.collideBottom, this.collideRight]);
            case "| |": return this.collideMany(target, tilePos, [this.collideLeft, this.collideRight]);
            case "|==": return this.collideMany(target, tilePos, [this.collideTop, this.collideBottom, this.collideLeft]);
            case "==|": return this.collideMany(target, tilePos, [this.collideTop, this.collideBottom, this.collideRight]);
            case "|^|": return this.collideMany(target, tilePos, [this.collideTop, this.collideLeft, this.collideRight]);
            case "|_|": return this.collideMany(target, tilePos, [this.collideBottom, this.collideLeft, this.collideRight]);
            case "XXX": return this.collideMany(target, tilePos, [this.collideTop, this.collideBottom, this.collideLeft, this.collideRight]);
            case "_-^": return this.collideSlopeUp(target, tilePos);
            case "^-_": return this.collideSlopeDown(target, tilePos);
            default: return;
        }
    }

    /** Handle tile collisions for a list of targets.
     *  @param {Array<MovablePhysics>} targets - The list of target Movables. */
    handleCollisions(targets) {
        for (let i in targets) {
            const target = targets[i];
            this.callCollisionHandler(target, target.topLeftPos);
            this.callCollisionHandler(target, target.topRightPos);
            this.callCollisionHandler(target, target.bottomLeftPos);
            this.callCollisionHandler(target, target.bottomRightPos);
        }
    }
}

export default CollisionMap;
