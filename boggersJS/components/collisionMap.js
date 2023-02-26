import { Grid, Vector2 } from '../common/index.js';
import { Movable } from '../components/index.js';

/** Handles tile-based collision by checking between the elements of a Grid 
 *  and the position and dimensions of a Movable.
 * 
 *  This code uses collision techniques from PothOnProgramming's tile tutorial. See the 
 *  tutorial code at
 *  {@link https://github.com/pothonprogramming/pothonprogramming.github.io/blob/master/content/tile-types/tile-types.js TileTypes}. 
 *  @memberof Components */
class CollisionMap {
    /** @type {Grid} */
    #grid

    /** Create the CollisionMap.
     *  @param {Grid} grid - The grid specifying the collision type of each tile. */
    constructor(grid) { this.#grid = grid; }

    /** Handle collisions from the top.
     *  @param {Movable} target - The target Movable.
     *  @param {Vector2} tilePos - The real position for a tile that is being checked.
     *  @returns {Array<number> | null} Either returns NULL if there is no collision 
     *      (so no snapping) or a triplet of numbers: [{0, 1} - axis, new pos for axis, 
     *      new velocity for axis] */
    #collideTop(target, tilePos) {
        if (target.pos.y + target.dimensions.y <= tilePos.y || target.oldPos.y + target.dimensions.y > tilePos.y) return null;
        return [1, tilePos.y - target.dimensions.y, 0];
    }

    /** Handle collisions from the bottom.
     *  @param {Movable} target - The target Movable.
     *  @param {Vector2} tilePos - The real position for a tile that is being checked.
     *  @returns {Array<number> | null} Either returns NULL if there is no collision 
     *      (so no snapping) or a triplet of numbers: [{0, 1} - axis, new pos for axis, 
     *      new velocity for axis] */
    #collideBottom(target, tilePos) {
        if (target.pos.y >= tilePos.y + this.#grid.unitDimensions.y || target.oldPos.y < tilePos.y + this.#grid.unitDimensions.y) return null;
        return [1, tilePos.y + this.#grid.unitDimensions.y, 0];
    }

    /** Handle collisions from the left.
     *  @param {Movable} target - The target Movable.
     *  @param {Vector2} tilePos - The real position for a tile that is being checked.
     *  @returns {Array<number> | null} Either returns NULL if there is no collision 
     *      (so no snapping) or a triplet of numbers: [{0, 1} - axis, new pos for axis, 
     *      new velocity for axis] */
    #collideLeft(target, tilePos) {
        if (target.pos.x + target.dimensions.x <= tilePos.x || target.oldPos.x + target.dimensions.x > tilePos.x) return null;
        return [0, tilePos.x - target.dimensions.x, 0];
    }

    /** Handle collisions from the right.
     *  @param {Movable} target - The target Movable.
     *  @param {Vector2} tilePos - The real position for a tile that is being checked.
     *  @returns {Array<number> | null} Either returns NULL if there is no collision 
     *      (so no snapping) or a triplet of numbers: [{0, 1} - axis, new pos for axis, 
     *      new velocity for axis] */
    #collideRight(target, tilePos) {
        if (target.pos.x >= tilePos.x + this.#grid.unitDimensions.x || target.oldPos.x < tilePos.x + this.#grid.unitDimensions.x) return null;
        return [0, tilePos.x + this.#grid.unitDimensions.x, 0];
    }

    /** Handle collisions for a slope rising from left to right.
     *  @param {Movable} target - The target Movable.
     *  @param {Vector2} tilePos - The real position for a tile that is being checked.
     *  @returns {Array<number> | null} Either returns NULL if there is no collision 
     *      (so no snapping) or a triplet of numbers: [{0, 1} - axis, new pos for axis, 
     *      new velocity for axis] */
    #collideSlopeUp(target, tilePos) {
        const origin = tilePos.copy(); 
        origin.y += this.#grid.unitDimensions.y;
        const difference = target.bottomRightPos.subCopy(origin);
        const crossProduct = -difference.x - difference.y;
        const oldDifference = target.oldBottomRightPos.subCopy(origin);
        const oldCrossProduct = -oldDifference.x - oldDifference.y;

        if (difference.x > this.#grid.unitDimensions.x && target.pos.y + target.dimensions.y > tilePos.y && target.oldPos.y + target.dimensions.y <= tilePos.y)
            return [1, tilePos.y - target.dimensions.y, 0]
        if (crossProduct < 1 && oldCrossProduct > -1) 
            return [1, tilePos.y - target.dimensions.y - difference.x + this.#grid.unitDimensions.y, 0];
        return null;
    }

    /** Handle collisions for a slope descending from left to right.
     *  @param {Movable} target - The target Movable.
     *  @param {Vector2} tilePos - The real position for a tile that is being checked.
     *  @returns {Array<number> | null} Either returns NULL if there is no collision 
     *      (so no snapping) or a triplet of numbers: [{0, 1} - axis, new pos for axis, 
     *      new velocity for axis] */
    #collideSlopeDown(target, tilePos) {
        const origin = tilePos.copy();
        const difference = target.bottomLeftPos.subCopy(origin);
        const crossProduct = difference.x - difference.y;
        const oldDifference = target.oldBottomLeftPos.subCopy(origin);
        const oldCrossProduct = oldDifference.x - oldDifference.y;

        if (difference.x < 0 && target.pos.y + target.dimensions.y > tilePos.y && target.oldPos.y + target.dimensions.y <= tilePos.y)
            return [1, tilePos.y - target.dimensions.y, 0]
        if (crossProduct < 1 && oldCrossProduct > -1)
            return [1, tilePos.y - target.dimensions.y + difference.x, 0]
        return null;
    }

    /** Check many collisions at once for a tile. Stops at the first collision it sees.
     *  @param {Movable} target - The target Movable.
     *  @param {Vector2} tilePos - The real position for a tile that is being checked.
     *  @param {boolean} checkTop - Whether to check for top collisions.
     *  @param {boolean} checkBottom - Whether to check for bottom collisions.
     *  @param {boolean} checkLeft - Whether to check for left collisions.
     *  @param {boolean} checkRight - Whether to check for right collisions.
     *  @returns {Array<number> | null} Either returns NULL if there is no collision 
     *      (so no snapping) or a triplet of numbers: [{0, 1} - axis, new pos for axis, 
     *      new velocity for axis] */
    #collideMany(target, tilePos, checkTop, checkBottom, checkLeft, checkRight) {
        let result = null;
        if (checkTop) result = this.#collideTop(target, tilePos);
        if (result) return result;
        if (checkBottom) result = this.#collideBottom(target, tilePos);
        if (result) return result;
        if (checkLeft) result = this.#collideLeft(target, tilePos);
        if (result) return result;
        if (checkRight) result = this.#collideRight(target, tilePos);
        return result;
    }

    /** Calls the appropiate collision handler based on the tile found at a target's corner.
     *  @param {Movable} target - The target Movable. 
     *  @param {Vector2} cornerPos - A corner of the target Movable to check. 
     *  @returns {Array<number> | null} Either returns NULL if there is no collision 
     *      (so no snapping) or a triplet of numbers: [{0, 1} - axis, new pos for axis, 
     *      new velocity for axis] */
    callCollisionHandler(target, cornerPos) {
        const buffer = cornerPos.copy();
        this.#grid.toGridPos(buffer);
        const collisionType = this.#grid.get(buffer);
        this.#grid.toRealPos(buffer);
        switch (collisionType) {
            case 1 : return this.#collideTop(target, buffer);
            case 2 : return this.#collideBottom(target, buffer);
            case 3 : return this.#collideLeft(target, buffer);
            case 4 : return this.#collideRight(target, buffer);
            case 5 : return this.#collideMany(target, buffer, true, true, false, false);
            case 6 : return this.#collideMany(target, buffer, true, false, true, false);
            case 7 : return this.#collideMany(target, buffer, true, false, false, true);
            case 8 : return this.#collideMany(target, buffer, false, true, true, false);
            case 9 : return this.#collideMany(target, buffer, false, true, false, true);
            case 10: return this.#collideMany(target, buffer, false, false, true, true);
            case 11: return this.#collideMany(target, buffer, true, true, true, false);
            case 12: return this.#collideMany(target, buffer, true, true, false, true);
            case 13: return this.#collideMany(target, buffer, true, false, true, true);
            case 14: return this.#collideMany(target, buffer, false, true, true, true);
            case 15: return this.#collideMany(target, buffer, true, true, true, true);
            case 16: return this.#collideSlopeUp(target, buffer);
            case 17: return this.#collideSlopeDown(target, buffer);
            default: return null;
        }
    }
}

export default CollisionMap;
