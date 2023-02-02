import { Grid, Vector2 } from '../common/index.js';
import { Movable } from '../components/index.js';

/** Handles tile-based collision by checking between the elements of a Grid 
 *  and the position and dimensions of a Movable.
 * 
 *  Collision code is based on PothOnProgramming's tile tutorial. See the 
 *  tutorial code at
 *  {@link https://github.com/pothonprogramming/pothonprogramming.github.io/blob/master/content/tile-types/tile-types.js TileTypes}. 
 *  @memberof Components */
class CollisionMap {
    /** @type {Grid} */
    #grid

    /** Create the CollisionMap.
     *  @param {Grid} grid - The grid specifying the collision type of each tile. */
    constructor(grid) {
        this.#grid = grid;
        this.collideBottom = this.collideBottom.bind(this);
        this.collideRight = this.collideRight.bind(this);
    }

    /** Handle collisions from the top.
     *  @param {Movable} target - The target Movable.
     *  @param {Vector2} tilePos - The real position for a tile that is being checked.
     *  @returns {Array<number> | null} Either returns NULL if there is no collision 
     *      (so no snapping) or a triplet of numbers: [{0, 1} - axis, new pos for axis, 
     *      new velocity for axis] */
    collideTop(target, tilePos) {
        if (target.pos.y + target.dimensions.y <= tilePos.y || target.oldPos.y + target.dimensions.y > tilePos.y)
            return null;
        return [1, tilePos.y - target.dimensions.y, 0];
    }

    /** Handle collisions from the bottom.
     *  @param {Movable} target - The target Movable.
     *  @param {Vector2} tilePos - The real position for a tile that is being checked.
     *  @returns {Array<number> | null} Either returns NULL if there is no collision 
     *      (so no snapping) or a triplet of numbers: [{0, 1} - axis, new pos for axis, 
     *      new velocity for axis] */
    collideBottom(target, tilePos) {
        if (target.pos.y >= tilePos.y + this.#grid.unitDimensions.y || target.oldPos.y < tilePos.y + this.#grid.unitDimensions.y)
            return null;
        return [1, tilePos.y + this.#grid.unitDimensions.y, 0];
    }

    /** Handle collisions from the left.
     *  @param {Movable} target - The target Movable.
     *  @param {Vector2} tilePos - The real position for a tile that is being checked.
     *  @returns {Array<number> | null} Either returns NULL if there is no collision 
     *      (so no snapping) or a triplet of numbers: [{0, 1} - axis, new pos for axis, 
     *      new velocity for axis] */
    collideLeft(target, tilePos) {
        if (target.pos.x + target.dimensions.x <= tilePos.x || target.oldPos.x + target.dimensions.x > tilePos.x)
            return null;
        return [0, tilePos.x - target.dimensions.x, 0];
    }

    /** Handle collisions from the right.
     *  @param {Movable} target - The target Movable.
     *  @param {Vector2} tilePos - The real position for a tile that is being checked.
     *  @returns {Array<number> | null} Either returns NULL if there is no collision 
     *      (so no snapping) or a triplet of numbers: [{0, 1} - axis, new pos for axis, 
     *      new velocity for axis] */
    collideRight(target, tilePos) {
        if (target.pos.x >= tilePos.x + this.#grid.unitDimensions.x || target.oldPos.x < tilePos.x + this.#grid.unitDimensions.x)
            return null;
        return [0, tilePos.x + this.#grid.unitDimensions.x, 0];
    }

    /** Handle collisions for a slope rising from left to right.
     *  @param {Movable} target - The target Movable.
     *  @param {Vector2} tilePos - The real position for a tile that is being checked.
     *  @returns {Array<number> | null} Either returns NULL if there is no collision 
     *      (so no snapping) or a triplet of numbers: [{0, 1} - axis, new pos for axis, 
     *      new velocity for axis] */
    collideSlopeUp(target, tilePos) {
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
    collideSlopeDown(target, tilePos) {
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
     *  @param {Array<CallableFunction>} collideFuncs - A list of collision functions to run through.
     *  @returns {Array<number> | null} Either returns NULL if there is no collision 
     *      (so no snapping) or a triplet of numbers: [{0, 1} - axis, new pos for axis, 
     *      new velocity for axis] */
    collideMany(target, tilePos, collideFuncs) {
        for (let i in collideFuncs) {
            const result = collideFuncs[i](target, tilePos);
            if (result) return result;
        }
        return null;
    }

    /** Calls the appropiate collision handler based on the tile found at a target's corner.
     *  Tiles are encoded as binary numbers where each bit position represents the side of
     *  a tile that is collidable. 0b00000 -> SLOPED-RIGHT-LEFT-BOTTOM-TOP]
     *  @param {Movable} target - The target Movable. 
     *  @param {Vector2} cornerPos - A corner of the target Movable to check. 
     *  @returns {Array<number> | null} Either returns NULL if there is no collision 
     *      (so no snapping) or a triplet of numbers: [{0, 1} - axis, new pos for axis, 
     *      new velocity for axis] */
    callCollisionHandler(target, cornerPos) {
        const gridPos = this.#grid.toGridPos(cornerPos);
        const tilePos = this.#grid.toRealPos(gridPos);
        switch (this.#grid.get(gridPos)) {
            case 1 : return this.collideTop(target, tilePos);
            case 2 : return this.collideBottom(target, tilePos);
            case 3 : return this.collideLeft(target, tilePos);
            case 4 : return this.collideRight(target, tilePos);
            case 5 : return this.collideMany(target, tilePos, [this.collideTop, this.collideBottom]);
            case 6 : return this.collideMany(target, tilePos, [this.collideTop, this.collideLeft]);
            case 7 : return this.collideMany(target, tilePos, [this.collideTop, this.collideRight]);
            case 8 : return this.collideMany(target, tilePos, [this.collideBottom, this.collideLeft]);
            case 9 : return this.collideMany(target, tilePos, [this.collideBottom, this.collideRight]);
            case 10: return this.collideMany(target, tilePos, [this.collideLeft, this.collideRight]);
            case 11: return this.collideMany(target, tilePos, [this.collideTop, this.collideBottom, this.collideLeft]);
            case 12: return this.collideMany(target, tilePos, [this.collideTop, this.collideBottom, this.collideRight]);
            case 13: return this.collideMany(target, tilePos, [this.collideTop, this.collideLeft, this.collideRight]);
            case 14: return this.collideMany(target, tilePos, [this.collideBottom, this.collideLeft, this.collideRight]);
            case 15: return this.collideMany(target, tilePos, [this.collideTop, this.collideBottom, this.collideLeft, this.collideRight]);
            case 16: return this.collideSlopeUp(target, tilePos);
            case 17: return this.collideSlopeDown(target, tilePos);
            default: return null;
        }
    }
}

export default CollisionMap;
