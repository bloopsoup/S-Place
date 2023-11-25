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

    /** Create the circle collider.
     *  @param {Rectangle} aabb - The box that the collider area will reside in.
     *      The AABB must be a square. */
    constructor(aabb) {
        if (!aabb.isSquare()) throw new Error('AABB for CircleCollider must be square');

        super(aabb);
        this.#radius = Math.floor(aabb.halfDimensions.x);
    }

    /** Gets the radius. 
     *  @returns {number} The radius. */
    get radius() { return this.#radius; }

    /** Checks whether a point collides with this circle.
     *  @param {Vector2} point - The point. 
     *  @returns {boolean} The result. */
    collidesWithPoint(point) { return this.aabb.centerPos.sub(point).magnitude() < this.#radius; }

    /** Checks whether a ray collides with this circle.
     * @param {Vector2} origin - The origin of the ray. 
     * @param {Vector2} direction - The direction of the ray (brings origin to end).
     * @returns {ColliderResult | null} The result or null if no hit. */
    collidesWithRay(origin, direction) {
        const center = this.aabb.centerPos;
        const distance = origin.subCopy(center);

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
        const contactNormal = contactPoint.subCopy(center).divScalar(this.#radius);
        return new ColliderResult(contactPoint, contactNormal, tEntry);
    }
}

export default CircleCollider;
