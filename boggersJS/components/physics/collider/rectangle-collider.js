import { Vector2 } from '../../../common/index.js';
import Collider from './collider.js';
import Rectangle from '../rectangle.js';
import ColliderResult from './collider-result.js';

/** A rectangle collider.
 *  @augments Collider
 *  @memberof Components.Physics.Collider */
class RectangleCollider extends Collider {
    /** Create the rectangle collider.
     *  @param {Rectangle} aabb - The box that the collider area will reside in. */
    constructor(aabb) { super(aabb); }

    /** Checks whether a point collides with this rectangle.
     *  @param {Vector2} point - The point. 
     *  @returns {boolean} The result. */
    collidesWithPoint(point) {
        const buffer = this.aabb.pos.copy();
        buffer.add(this.aabb.dimensions);
        return point.greaterThan(this.aabb.pos) && point.lessThan(buffer);
    }

    /** Checks whether a ray collides with this rectangle.
     *  @param {Vector2} origin - The origin of the ray. 
     *  @param {Vector2} direction - The direction of the ray.
     *  @returns {ColliderResult | null} The result or null if no hit. */
    collidesWithRay(origin, direction) {
        const aabbMaxPos = this.aabb.maxPos;
    
        // Find potential entry and exit points for the ray
        const t1 = this.aabb.pos.subCopy(origin);
        t1.div(direction);
        const t2 = this.aabb.maxPos;
        t2.sub(origin);
        t2.div(direction);

        if (direction.x === 0 && (origin.x <= this.aabb.pos.x || origin.x >= aabbMaxPos.x)) return null;
        if (direction.y === 0 && (origin.y <= this.aabb.pos.y || origin.y >= aabbMaxPos.y)) return null;
        
        const tmp = t1.copy();
        t1.select(t2, true, true);
        t2.select(tmp, false, false);

        // Find the actual times of contact
        const tEntry = t1.max();
        const tExit = t2.min();
        if (tExit <= tEntry || tExit <= 0 || tEntry >= 1) return null;

        // Calculate hit information
        const contactPoint = direction.copy();
        contactPoint.mulScalar(tEntry);
        contactPoint.add(origin);
        
        const delta = contactPoint.subCopy(this.aabb.centerPos);
        const p = this.aabb.halfDimensions.subCopy(delta.absCopy());
        let contactNormal = new Vector2(
            p.x < p.y ? Math.sign(delta.x) : 0, 
            p.x >= p.y ? Math.sign(delta.y) : 0
        );
        return new ColliderResult(contactPoint, contactNormal, tEntry);
    }
}

export default RectangleCollider;
