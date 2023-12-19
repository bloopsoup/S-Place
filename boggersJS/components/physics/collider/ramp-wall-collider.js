import { Vector2 } from '../../../common/index.js';
import Collider from './collider.js';
import ColliderResult from './collider-result.js';
import Rectangle from '../rectangle.js';

/** A ramp wall collider.
 *  @augments Collider
 *  @memberof Components.Physics.Collider */
class RampWallCollider extends Collider {
    /** @type {Vector2} */
    #rampStart
    /** @type {Vector2} */
    #rampEnd

    /** Create the ramp wall collider.
     *  @param {Rectangle} aabb - The box that the collider area will reside in.
     *  @param {boolean} left - Whether the ramp is rising from left to right. */
    constructor(aabb, left) {
        super(aabb);
        const pos = aabb.pos;
        const maxPos = aabb.maxPos;
        this.#rampStart = left ? new Vector2(pos.x, maxPos.y) : new Vector2(pos.x, pos.y);
        this.#rampEnd = left ? new Vector2(maxPos.x, pos.y) : new Vector2(maxPos.x, maxPos.y);
    }

    /** Always returns FALSE as walls have no point collision.
     *  @param {Vector2} point - The point. 
     *  @returns {boolean} The result. */
    collidesWithPoint(point) { return false; }

    /** Checks whether a ray collides with this ramp.
     * @param {Vector2} origin - The origin of the ray. 
     * @param {Vector2} direction - The direction of the ray (brings origin to end).
     * @returns {ColliderResult | null} The result or null if no hit. */
    collidesWithRay(origin, direction) {
        const rampDirection = this.#rampEnd.subCopy(this.#rampStart);
        const crossProduct = direction.crossProduct(rampDirection);
        if (crossProduct === 0) return null;

        const t = this.#rampStart.subCopy(origin).crossProduct(rampDirection) / crossProduct;
        const s = origin.subCopy(this.#rampStart).crossProduct(direction) / crossProduct;
        if (t < 0 || s < 0 || s > 1) return null;

        const contactPoint = direction.copy().mulScalar(t).add(origin);
        const contactNormal = rampDirection.copy().normalize();
        return new ColliderResult(contactPoint, contactNormal, t);
    }
}

export default RampWallCollider;
