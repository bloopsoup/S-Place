import Vector2 from "../common/vector2.js";

export default class CollisionMap {
    /** A 2D-grid that handles tile-based collision for MovablePhysics objects.
     *  Collision code is based on PothOnProgramming's tile tutorial. See the tutorial code at
     *  {@link https://github.com/pothonprogramming/pothonprogramming.github.io/blob/master/content/tile-types/tile-types.js TileTypes}. */

    #unitDimensions
    #grid
    #mapDimensions

    constructor(unitDimensions, grid) {
        this.#unitDimensions = unitDimensions;
        this.#grid = grid;
        this.#mapDimensions = new Vector2(this.#grid[0].length * this.#unitDimensions.x, this.#grid.length * this.#unitDimensions.y);

        this.collideBottom = this.collideBottom.bind(this);
        this.collideRight = this.collideRight.bind(this);
    }

    get mapDimensions() { return this.#mapDimensions; }

    toGridPos(realPos) { return realPos.floorDivCopy(this.#unitDimensions); }
    toRealPos(gridPos) { return gridPos.mulCopy(this.#unitDimensions); }

    collideTop(target, tilePos) {
        if (target.pos.y + target.dimensions.y <= tilePos.y || target.oldPos.y + target.dimensions.y > tilePos.y)
            return false;
        target.pos.y = tilePos.y - target.dimensions.y;
        target.velocity.y = 0;
        return true;
    }
    collideBottom(target, tilePos) {
        if (target.pos.y >= tilePos.y + this.#unitDimensions.y || target.oldPos.y < tilePos.y + this.#unitDimensions.y)
            return false;
        target.pos.y = tilePos.y + this.#unitDimensions.y;
        target.velocity.y = 0;
        return true;
    }
    collideLeft(target, tilePos) {
        if (target.pos.x + target.dimensions.x <= tilePos.x || target.oldPos.x + target.dimensions.x > tilePos.x)
            return false;
        target.pos.x = tilePos.x - target.dimensions.x;
        target.velocity.x = 0;
        return true;
    }
    collideRight(target, tilePos) {
        if (target.pos.x >= tilePos.x + this.#unitDimensions.x || target.oldPos.x < tilePos.x + this.#unitDimensions.x)
            return false;
        target.pos.x = tilePos.x + this.#unitDimensions.x;
        target.velocity.x = 0;
        return true;
    }

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
        }
    }
    collideSlopeDown(target, tilePos) {
        const origin = tilePos.copy();

        const difference = target.bottomLeftPos.subCopy(origin);
        const crossProduct = difference.x - difference.y;
        const oldDifference = target.oldBottomLeftPos.subCopy(origin);
        const oldCrossProduct = oldDifference.x - oldDifference.y;

        if (crossProduct < 1 && oldCrossProduct > -1) {
            target.pos.y = tilePos.y - target.dimensions.y + difference.x;
            target.velocity.y = 0;
        }
    }

    collideMany(target, tilePos, collideFuncs) {
        for (let i in collideFuncs)
            if (collideFuncs[i](target, tilePos)) return;
    }

    callCollisionHandler(target, cornerPos) {
        const gridPos = this.toGridPos(cornerPos);
        const tilePos = this.toRealPos(gridPos);
        switch (this.#grid[Math.min(this.#grid.length, gridPos.y)][Math.min(this.#grid[0].length, gridPos.x)]) {
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

    handleCollisions(targets) {
        for (let i in targets) {
            const target = targets[i]
            this.callCollisionHandler(target, target.topLeftPos);
            this.callCollisionHandler(target, target.topRightPos);
            this.callCollisionHandler(target, target.bottomLeftPos);
            this.callCollisionHandler(target, target.bottomRightPos);
        }
    }
}
