import { Vector2 } from '../../../common/index.js';
import Rectangle from '../rectangle.js';
import Collider from './collider.js';
import RectangleCollider from './rectangle-collider.js';
import CircleCollider from './circle-collider.js';
import ColliderResult from './collider-result.js';

/** Resolves collisions between different colliders.
 *  Features continuous / discrete collision methods to suit
 *  varying needs of precision and performance. 
 *  @memberof Components.Physics.Collider */
class ColliderResolver {
    /** Checks for a collision between two rectangle colliders.
     *  @param {RectangleCollider} a - The first.
     *  @param {RectangleCollider} b - The second.
     *  @returns {boolean} The result. */
    static checkRectToRectCollides(a, b) { return b.aabb.pos.lessThan(a.aabb.maxPos) && a.aabb.pos.lessThan(b.aabb.maxPos); }
    
    /** Checks for a collision between two MOVING rectangle colliders.
     *  @param {RectangleCollider} a - The first (treated as moving).
     *  @param {RectangleCollider} b - The second.
     *  @returns {ColliderResult | null} The result. */
    static checkSweptRectToRectCollides(a, b) {
        const relativeVelocity = a.aabb.velocity.subCopy(b.aabb.velocity);
        if (relativeVelocity.isZero()) return null;

        const expandedRectangle = new RectangleCollider(new Rectangle(
            a.aabb.dimensions.addCopy(b.aabb.dimensions), 
            b.aabb.pos.subCopy(a.aabb.halfDimensions)
        ));
        return expandedRectangle.collidesWithRay(a.aabb.centerPos, relativeVelocity);
    }

    /** Finds an MTV to resolve collision between two rectangle colliders.
     *  @param {RectangleCollider} a - The first.
     *  @param {RectangleCollider} b - The second.
     *  @returns {Vector2} The minimum translation vector to apply to A. */
    static findRectToRectMTV(a, b) {
        if (!this.checkRectToRectCollides(a, b)) return new Vector2(0, 0);
        const overlap = a.aabb.maxPos
            .select(b.aabb.maxPos, true, true)
            .sub(a.aabb.pos.copy()
            .select(b.aabb.pos, false, false));

        if (overlap.x < overlap.y) return a.aabb.pos.x < b.aabb.pos.x ? new Vector2(-overlap.x, 0) : new Vector2(overlap.x, 0);
        else return a.aabb.pos.y < b.aabb.pos.y ? new Vector2(0, -overlap.y) : new Vector2(0, overlap.y);
    }

    /** Finds an MTV to resolve collision between two MOVING rectangle colliders.
     *  @param {RectangleCollider} a - The first (treated as moving).
     *  @param {RectangleCollider} b - The second.
     *  @returns {Vector2} The minimum translation vector to apply to A. */
    static findSweptRectToRectMTV(a, b) {
        let mtv = this.findRectToRectMTV(a, b);
        if (!mtv.isZero()) return mtv;

        const result = this.checkSweptRectToRectCollides(a, b);
        return result ? result.contactPoint.subCopy(a.aabb.centerPos) : new Vector2(0, 0);
    }

    /** Checks for a collision between two circle colliders.
     *  @param {CircleCollider} a - The first.
     *  @param {CircleCollider} b - The second.
     *  @returns {boolean} The result. */
    static checkCircleToCircleCollides(a, b) { return a.centerPos.sub(b.centerPos).magnitude() < a.radius + b.radius; }

    /** Checks for a collision between two MOVING circle colliders.
     *  @param {CircleCollider} a - The first (treated as moving).
     *  @param {CircleCollider} b - The second.
     *  @returns {ColliderResult | null} The result. */
    static checkSweptCircleToCircleCollides(a, b) {
        const relativeVelocity = a.aabb.velocity.subCopy(b.aabb.velocity);
        if (relativeVelocity.isZero()) return null;

        const expandedCircle = new CircleCollider(new Rectangle(
            a.aabb.dimensions.addCopy(b.aabb.dimensions), 
            b.aabb.pos.subCopy(a.aabb.halfDimensions)
        ));
        return expandedCircle.collidesWithRay(a.centerPos, relativeVelocity);
    }

    /** Finds an MTV to resolve collision between two circle colliders.
     *  @param {CircleCollider} a - The first. 
     *  @param {CircleCollider} b - The second.
     *  @returns {Vector2} The minimum translation vector to apply to A. */
    static findCircleToCircleMTV(a, b) {
        if (!this.checkCircleToCircleCollides(a, b)) return new Vector2(0, 0);

        const mtv = a.centerPos.sub(b.centerPos);
        const distance = mtv.magnitude();
        return mtv.normalize().mulScalar(a.radius + b.radius - distance);
    }

    /** Finds an MTV to resolve collision between two MOVING circle colliders.
     *  @param {CircleCollider} a - The first (treated as moving).
     *  @param {CircleCollider} b - The second.
     *  @returns {Vector2} The minimum translation vector to apply to A. */
    static findSweptCircleToCircleMTV(a, b) {
        let mtv = this.findCircleToCircleMTV(a, b);
        if (!mtv.isZero()) return mtv;

        const result = this.checkSweptCircleToCircleCollides(a, b);
        return result ? result.contactPoint.subCopy(a.centerPos) : new Vector2(0, 0);
    }

    /** Checks for a collision between a rectangle and a circle collider.
     *  @param {RectangleCollider} a - The first. 
     *  @param {CircleCollider} b - The second.
     *  @returns {boolean} The result. */
    static checkRectToCircleCollides(a, b) {
        const distance = a.aabb.pos
            .addCopy(a.aabb.dimensions)
            .select(b.centerPos, true, true)
            .select(a.aabb.pos, false, false)
            .sub(b.centerPos)
            .magnitude();
        return distance < b.radius;
    }

    /** Finds an MTV to resolve collision between a rectangle and circle collider.
     * @param {RectangleCollider} a - The first.
     * @param {CircleCollider} b - The second.
     * @returns {Vector2} The minimum translation vector to apply to A. */
    static findRectToCircleMTV(a, b) {
        if (!this.checkRectToCircleCollides(a, b)) return new Vector2(0, 0);

        const mtv = a.aabb.pos.addCopy(a.aabb.dimensions)
            .select(b.centerPos, true, true)
            .select(a.aabb.pos, false, false)
            .sub(b.centerPos);
        const distance = mtv.magnitude();

        // If you want to apply it to a circle, negate the scalar
        return mtv.normalize().mulScalar(distance - b.radius);
    }
}

export default ColliderResolver;
