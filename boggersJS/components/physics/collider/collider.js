import ColliderResult from './collider-result.js';
import { Vector2 } from '../../../common/index.js';
import Rectangle from '../rectangle.js';

/** A base collider. Every collider has an AABB.
 *  @memberof Components.Physics.Collider */
class Collider {
    /** @type {Rectangle} */
    #aabb

    /** Create the base collider.
     *  @param {Rectangle} aabb - The box that the collider area will reside in. */
    constructor(aabb) { this.#aabb = aabb; }

    /** Gets the AABB.
     *  @returns {Rectangle} The AABB.
     *  @readonly */
    get aabb() { return this.#aabb; }

    /** Checks whether a point collides with this collider.
     *  @param {Vector2} point - The point. 
     *  @returns {boolean} The result. */
    collidesWithPoint(point) { throw new Error('Implement!'); }

    /** Checks whether a ray collides with this collider.
     * @param {Vector2} origin - The origin of the ray. 
     * @param {Vector2} direction - The direction of the ray.
     * @returns {ColliderResult | null} The result or null if no hit. */
    collidesWithRay(origin, direction) { throw new Error('Implement!'); }
}

export default Collider;
