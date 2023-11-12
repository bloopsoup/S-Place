import { Vector2 } from '../../../common/index.js';
import Collider from './collider.js';
import Rectangle from '../rectangle.js';

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
}

export default RectangleCollider;
