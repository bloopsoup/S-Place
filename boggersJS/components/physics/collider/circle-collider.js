import { Vector2 } from '../../../common/index.js';
import Collider from './collider.js';
import Rectangle from '../rectangle.js';
import ColliderResult from './collider-result.js';

/** A circle collider.
 *  @augments Collider
 *  @memberof Components.Physics.Collider */
class CircleCollider extends Collider {
    /** @type {number} */
    #radius
    /** @type {Vector2} */
    #offset

    /** Create the circle collider.
     *  @param {Rectangle} aabb - The box that the collider area will reside in. */
    constructor(aabb) {
        super(aabb);
        this.#radius = Math.floor(aabb.halfDimensions.min());
        this.#offset = new Vector2(this.#radius, this.#radius);
    }

    /** Gets the radius. 
     *  @returns {number} The radius. */
    get radius() { return this.#radius; }

    /** Gets the old position of the center.
     *  @returns {Vector2} The old center position. */
    get oldCenterPos() { return this.aabb.oldPos.addCopy(this.#offset); }

    /** Gets the position of the center.
     *  @returns {Vector2} The center position. */
    get centerPos() { return this.aabb.pos.addCopy(this.#offset); }

    /** Checks whether a point collides with this circle.
     *  @param {Vector2} point - The point. 
     *  @returns {boolean} The result. */
    collidesWithPoint(point) { return this.centerPos.sub(point).magnitude() < this.#radius; }

    /** Checks whether a ray collides with this circle.
     * @param {Vector2} origin - The origin of the ray. 
     * @param {Vector2} direction - The direction of the ray.
     * @returns {ColliderResult | null} The result or null if no hit. */
    collidesWithRay(origin, direction) { throw new Error('Implement!'); }
}

export default CircleCollider;
