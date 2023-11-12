import { Vector2 } from '../../../common/index.js';
import Collider from './collider.js';
import RectangleCollider from './rectangle-collider.js';
import CircleCollider from './circle-collider.js';

/** Resolves collisions between different colliders.
 *  Features continuous / discrete collision methods to suit
 *  varying needs of precision and performance. 
 *  @memberof Components.Physics.Collider */
class ColliderResolver {
    /** Checks for a collision between two rectangle colliders.
     *  @param {RectangleCollider} a - The first.
     *  @param {RectangleCollider} b - The second.
     *  @returns {boolean} The result. */
    static checkRectToRectCollides(a, b) {
        const buffer = a.aabb.pos.copy();
        buffer.add(a.aabb.dimensions);
        if (!b.aabb.pos.lessThan(buffer)) return false;
        b.aabb.pos.copyTo(buffer);
        buffer.add(b.aabb.dimensions);
        return a.aabb.pos.lessThan(buffer);
    }

    /** Checks for a collision between two circle colliders.
     *  @param {CircleCollider} a - The first.
     *  @param {CircleCollider} b - The second.
     *  @returns {boolean} The result. */
    static checkCircleToCircleCollides(a, b) {
        const buffer = a.centerPos;
        a.centerPos.sub(b.centerPos);
        return buffer.magnitude() < a.radius + b.radius;
    }

    /** Checks for a collision between a rectangle and a circle collider.
     *  @param {RectangleCollider} a - The first. 
     *  @param {CircleCollider} b - The second.
     *  @returns {boolean} The result. */
    static checkRectToCircleCollides(a, b) {
        const buffer = a.aabb.pos.copy();
        buffer.add(a.aabb.dimensions);
        buffer.select(b.centerPos, true, true);
        buffer.select(a.aabb.pos, false, false);
        buffer.sub(b.centerPos);
        return buffer.magnitude() < b.radius;
    }

    /** Finds an MTV to resolve collision between two rectangle colliders.
     *  @param {RectangleCollider} a - The first.
     *  @param {RectangleCollider} b - The second.
     *  @returns {Vector2} The minimum translation vector to apply to A. */
    static findRectToRectMTV(a, b) {
        if (!this.checkRectToRectCollides(a, b)) return new Vector2(0, 0);

        const buffer = a.aabb.pos.addCopy(a.aabb.dimensions);
        buffer.select(b.aabb.pos.addCopy(b.aabb.dimensions), true, true);
        const buffer2 = a.aabb.pos.copy();
        buffer2.select(b.aabb.pos, false, false);
        const overlap = buffer.subCopy(buffer2);

        if (overlap.x < overlap.y) return a.aabb.pos.x < b.aabb.pos.x ? new Vector2(-overlap.x, 0) : new Vector2(overlap.x, 0);
        else return a.aabb.pos.y < b.aabb.pos.y ? new Vector2(0, -overlap.y) : new Vector2(0, overlap.y);
    }

    /** Finds an MTV to resolve collision between two circle colliders.
     *  @param {CircleCollider} a - The first. 
     *  @param {CircleCollider} b - The second.
     *  @returns {Vector2} The minimum translation vector to apply to A. */
    static findCircleToCircleMTV(a, b) {
        if (!this.checkCircleToCircleCollides(a, b)) return new Vector2(0, 0);

        const buffer = a.centerPos;
        a.centerPos.sub(b.centerPos);

        const distance = buffer.magnitude();
        buffer.normalize();
        buffer.mulScalar(a.radius + b.radius - distance);

        return buffer;
    }

    /** Finds an MTV to resolve collision between a rectangle and circle collider.
     * @param {RectangleCollider} a - The first.
     * @param {CircleCollider} b - The second.
     * @returns {Vector2} The minimum translation vector to apply to A. */
    static findRectToCircleMTV(a, b) {
        if (!this.checkRectToCircleCollides(a, b)) return new Vector2(0, 0);

        const buffer = a.aabb.pos.copy();
        buffer.add(a.aabb.dimensions);
        buffer.select(b.centerPos, true, true);
        buffer.select(a.aabb.pos, false, false);
        buffer.sub(b.centerPos);

        const distance = buffer.magnitude();
        buffer.normalize();
        // If you want to apply it to the circle, negate this
        buffer.mulScalar(distance - b.radius);
        
        return buffer;
    }
}

export default ColliderResolver;
