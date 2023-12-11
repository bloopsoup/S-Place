import { Vector2 } from '../../../common/index.js';
import Collider from './collider.js';
import RectangleCollider from './rectangle-collider.js';
import ColliderResult from './collider-result.js';
import Rectangle from '../rectangle.js';

/** A wall collider.
 *  @augments Collider
 *  @memberof Components.Physics.Collider */
class WallCollider extends Collider {
    /** @type {Array<Vector2>} */
    #sides = [new Vector2(0, -1), new Vector2(1, 0), new Vector2(0, 1), new Vector2(-1, 0)]
    /** @type {RectangleCollider} */
    #rectangleCollider
    /** @type {Array<boolean>} */
    #toggledSides

    /** Create the wall collider.
     *  @param {Rectangle} aabb - The box that the collider area will reside in.
     *  @param {Array<boolean>} toggledSides - A boolean array indicating which sides are collidable.
     *      Arranged as [TOP, RIGHT, SOUTH, LEFT]. */
    constructor(aabb, toggledSides) {
        super(aabb);
        this.#rectangleCollider = new RectangleCollider(aabb);
        this.#toggledSides = toggledSides;
    }

    /** Determines whether a given direction can collide with a wall side.
     *  @param {Vector2} direction - The direction to check. 
     *  @returns {boolean} The result. */
    #validDirection(direction) {
        const normalized = direction.copy().normalize();
        for (let i = 0; i < this.#toggledSides.length; i++) {
            if (!this.#toggledSides[i]) continue;
            if (Math.acos(normalized.dotProduct(this.#sides[i])) <= Math.PI) return true;
        }
        return false;
    }

    /** Always returns FALSE as walls have no point collision.
     *  @param {Vector2} point - The point. 
     *  @returns {boolean} The result. */
    collidesWithPoint(point) { return false; }

    /** Checks whether a ray collides with this wall.
     *  @param {Vector2} origin - The origin of the ray. 
     *  @param {Vector2} direction - The direction of the ray (brings origin to end).
     *  @returns {ColliderResult | null} The result or null if no hit. */
    collidesWithRay(origin, direction) {
        if (!this.#validDirection(direction)) return null;
        return this.#rectangleCollider.collidesWithRay(origin, direction);
    }    
}

export default WallCollider;
