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

    /** Gets the position of the center.
     *  @returns {Vector2} The center position. */
    get centerPos() { return this.aabb.pos.addCopy(this.#offset); }

    /** Gets the next position of the center.
     *  @returns {Vector2} The center position. */
    get nextCenterPos() { return this.aabb.nextPos.addCopy(this.#offset); }

    /** Checks whether a point collides with this circle.
     *  @param {Vector2} point - The point. 
     *  @returns {boolean} The result. */
    collidesWithPoint(point) { return this.centerPos.sub(point).magnitude() < this.#radius; }

    /** Checks whether a ray collides with this circle.
     * @param {Vector2} origin - The origin of the ray. 
     * @param {Vector2} direction - The direction of the ray (brings origin to end).
     * @returns {ColliderResult | null} The result or null if no hit. */
    collidesWithRay(origin, direction) {
        const distance = origin.subCopy(this.centerPos);

        // Find the discriminant
        const a = direction.dotProduct(direction);
        const b = 2 * distance.dotProduct(direction);
        const c = distance.dotProduct(distance) - Math.pow(this.radius, 2);
        let discriminant = Math.pow(b, 2) - (4 * a * c);
        if (discriminant < 0) return null;

        // Find the actual times of contact
        discriminant = Math.sqrt(discriminant);
        const t1 = (-b - discriminant) / (2 * a);
        const t2 = (-b + discriminant) / (2 * a);
        if ((t1 < 0 || t1 > 1) && (t2 < 0 || t2 > 1)) return null;

        // Calculate hit information
        const tEntry = (t1 >= 0 && t1 <= 1) ? t1 : t2;
        const contactPoint = direction.copy().mulScalar(tEntry).add(origin);
        const contactNormal = contactPoint.subCopy(this.centerPos).divScalar(this.radius);
        return new ColliderResult(contactPoint, contactNormal, tEntry);
    }
}

export default CircleCollider;
