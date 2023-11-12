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
}

export default Collider;
