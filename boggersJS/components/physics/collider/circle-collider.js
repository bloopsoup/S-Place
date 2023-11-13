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
    /** @type {number} */
    #offset

    /** Create the circle collider.
     *  @param {Rectangle} aabb - The box that the collider area will reside in. */
    constructor(aabb) {
        super(aabb);
        this.#radius = Math.floor(aabb.dimensions.min() / 2);
        this.#offset = Math.floor(this.#radius * Math.SQRT2);
    }

    /** Gets the radius. 
     *  @returns {number} The radius. */
    get radius() { return this.#radius; }

    /** Gets the old position of the center.
     *  @returns {Vector2} The old center position. */
    get oldCenterPos() { return this.aabb.oldPos.addCopy(new Vector2(this.#offset, this.#offset)); }

    /** Gets the position of the center.
     *  @returns {Vector2} The center position. */
    get centerPos() { return this.aabb.pos.addCopy(new Vector2(this.#offset, this.#offset)); }

    /** Checks whether a point collides with this circle.
     *  @param {Vector2} point - The point. 
     *  @returns {boolean} The result. */
    collidesWithPoint(point) { 
        const dist = this.centerPos;
        this.centerPos.sub(point);
        return dist.magnitude() < this.#radius;
    }

    /** Checks whether a ray collides with this circle.
     * @param {Vector2} origin - The origin of the ray. 
     * @param {Vector2} direction - The direction of the ray.
     * @returns {ColliderResult | null} The result or null if no hit. */
    collidesWithRay(origin, direction) { throw new Error('Implement!'); }
}

export default CircleCollider;
