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
        const relativeVelocity = a.aabb.velocity.sub(b.aabb.velocity);
        if (relativeVelocity.isZero()) return null;

        const expandedRectangle = new RectangleCollider(new Rectangle(
            a.aabb.dimensions.add(b.aabb.dimensions), 
            b.aabb.pos.sub(a.aabb.halfDimensions)
        ));
        return expandedRectangle.collidesWithRay(a.aabb.centerPos, relativeVelocity);
    }

    /** Finds an MTV to resolve collision between two COMPLETELY OVERLAPPING rectangle colliders.
     *  This serves to fallback from a pathological case, so it's not precise.
     *  @param {RectangleCollider} a - The first.
     *  @param {RectangleCollider} b - The second.
     *  @returns {Vector2} The minimum translation vector to apply to A. */
    static #findCompletelyOverlappingRectToRectMTV(a, b) {
        const aDimensions = a.aabb.dimensions;
        const topLeftDiff = a.aabb.pos.sub(b.aabb.pos);
        const bottomRightDiff = b.aabb.maxPos.sub(a.aabb.maxPos);
        const topLeftMTV = topLeftDiff.x < topLeftDiff.y ? new Vector2(-topLeftDiff.x - aDimensions.x, 0) : new Vector2(0, -topLeftDiff.y - aDimensions.y);
        const bottomRightMTV = bottomRightDiff.x < bottomRightDiff.y ? new Vector2(bottomRightDiff.x + aDimensions.x, 0) : new Vector2(0, bottomRightDiff.y + aDimensions.y);
        return topLeftMTV.magnitude() < bottomRightMTV.magnitude() ? topLeftMTV : bottomRightMTV;
    }

    /** Finds an MTV to resolve collision between two rectangle colliders.
     *  @param {RectangleCollider} a - The first.
     *  @param {RectangleCollider} b - The second.
     *  @returns {Vector2} The minimum translation vector to apply to A. */
    static findRectToRectMTV(a, b) {
        if (!this.checkRectToRectCollides(a, b)) return new Vector2(0, 0);
        
        // Caching position data
        const aPos = a.aabb.pos;
        const bPos = b.aabb.pos;
        const aMaxPos = a.aabb.maxPos;
        const bMaxPos = b.aabb.maxPos;

        // Handle cases of complete overlap
        if (aPos.greaterThan(bPos) && bMaxPos.greaterThan(aMaxPos)) return this.#findCompletelyOverlappingRectToRectMTV(a, b);
        if (aPos.lessThan(bPos) && bMaxPos.lessThan(aMaxPos)) return this.#findCompletelyOverlappingRectToRectMTV(b, a).mulScalar(-1);
        
        // Calculate the overlap
        const overlap = a.aabb.maxPos
            .select(bMaxPos, true, true)
            .sub(a.aabb.pos.select(bPos, false, false));
        
        if (overlap.x < overlap.y) return aPos.x < bPos.x ? new Vector2(-overlap.x, 0) : new Vector2(overlap.x, 0);
        else return aPos.y < bPos.y ? new Vector2(0, -overlap.y) : new Vector2(0, overlap.y);
    }

    /** Finds an MTV to resolve collision between two MOVING rectangle colliders.
     *  @param {RectangleCollider} a - The first (treated as moving).
     *  @param {RectangleCollider} b - The second.
     *  @returns {Vector2} The minimum translation vector to apply to A. */
    static findSweptRectToRectMTV(a, b) {
        let mtv = this.findRectToRectMTV(a, b);
        if (!mtv.isZero()) return mtv;

        const result = this.checkSweptRectToRectCollides(a, b);
        return result ? result.contactPoint.sub(a.aabb.centerPos) : new Vector2(0, 0);
    }

    /** Checks for a collision between two circle colliders.
     *  @param {CircleCollider} a - The first.
     *  @param {CircleCollider} b - The second.
     *  @returns {boolean} The result. */
    static checkCircleToCircleCollides(a, b) { return a.aabb.centerPos.sub(b.aabb.centerPos).magnitude() < a.radius + b.radius; }

    /** Checks for a collision between two MOVING circle colliders.
     *  @param {CircleCollider} a - The first (treated as moving).
     *  @param {CircleCollider} b - The second.
     *  @returns {ColliderResult | null} The result. */
    static checkSweptCircleToCircleCollides(a, b) {
        const relativeVelocity = a.aabb.velocity.sub(b.aabb.velocity);
        if (relativeVelocity.isZero()) return null;

        const expandedCircle = new CircleCollider(new Rectangle(
            a.aabb.dimensions.add(b.aabb.dimensions),
            b.aabb.pos.sub(a.aabb.halfDimensions)
        ));
        return expandedCircle.collidesWithRay(a.aabb.centerPos, relativeVelocity);
    }

    /** Finds an MTV to resolve collision between two circle colliders.
     *  @param {CircleCollider} a - The first. 
     *  @param {CircleCollider} b - The second.
     *  @returns {Vector2} The minimum translation vector to apply to A. */
    static findCircleToCircleMTV(a, b) {
        if (!this.checkCircleToCircleCollides(a, b)) return new Vector2(0, 0);

        const mtv = a.aabb.centerPos.sub(b.aabb.centerPos);
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
        return result ? result.contactPoint.sub(a.aabb.centerPos) : new Vector2(0, 0);
    }

    /** Checks for a collision between a rectangle and a circle collider.
     *  @param {RectangleCollider} a - The first. 
     *  @param {CircleCollider} b - The second.
     *  @returns {boolean} The result. */
    static checkRectToCircleCollides(a, b) {
        const bCenterPos = b.aabb.centerPos;
        const distance = a.aabb.pos
            .add(a.aabb.dimensions)
            .select(bCenterPos, true, true)
            .select(a.aabb.pos, false, false)
            .sub(bCenterPos)
            .magnitude();
        return distance < b.radius;
    }

    /** Checks for a collision between moving rectangle and circle colliders.
     *  @param {RectangleCollider} a - The first (treated as moving).
     *  @param {CircleCollider} b - The second.
     *  @param {boolean} flipped - Whether to treat A as the circle instead.
     *  @returns {ColliderResult | null} The result. */
    static checkSweptRectToCircleCollides(a, b, flipped = false) {
        const relativeVelocity = a.aabb.velocity.sub(b.aabb.velocity);
        if (relativeVelocity.isZero()) return null;

        // Bounding box for rounded rectangle
        const aCenterPos = a.aabb.centerPos;
        const bDimensions = b.aabb.dimensions;
        const enclosing = new Rectangle(a.aabb.dimensions.add(bDimensions), b.aabb.pos.sub(a.aabb.halfDimensions));
        const enclosingDimensions = enclosing.dimensions;

        // Result will be the ray hit with the NEAREST time
        let result = null;

        // Check the corner circles
        const circleStart = enclosing.pos;
        const circleOffset = enclosing.dimensions.sub(bDimensions);
        let directions = [new Vector2(0, 0), new Vector2(0, 1), new Vector2(1, 0), new Vector2(1, 1)];
        for (const dir of directions) {
            const collider = new CircleCollider(new Rectangle(bDimensions.copy(), circleOffset.mulCopy(dir).add(circleStart)));
            const current = collider.collidesWithRay(aCenterPos, relativeVelocity);
            if (current && (result === null || current.hitTime < result.hitTime)) result = current;
        }

        // Check the AABBs
        const rectStart = circleStart;
        const rectOffset = new Vector2(b.radius, b.radius);
        directions = [new Vector2(0, 1), new Vector2(1, 0)];
        for (const dir of directions) {
            const collider = new RectangleCollider(new Rectangle(enclosingDimensions.subCopy(bDimensions.mulCopy(dir)), rectOffset.mulCopy(dir).add(rectStart)));
            const current = collider.collidesWithRay(aCenterPos, relativeVelocity);
            if (current && (result === null || current.hitTime < result.hitTime)) result = current;
        }

        // If it's flipped, we need to translate the contact point
        if (flipped && result) result = new ColliderResult(a.aabb.centerPos.sub(result.contactPoint).add(b.aabb.centerPos), result.contactNormal.mulScalar(-1), result.hitTime);
        return result;
    }

    /** Finds an MTV to resolve collision between a COMPLETELY OVERLAPPING rectangle and 
     *  circle collider. This occurs when the center of the circle is INSIDE the AABB.
     *  This serves to fallback from a pathological case, so it's not precise.
     *  @param {RectangleCollider} a - The first.
     *  @param {CircleCollider} b - The second.
     *  @param {boolean} flipped - Whether to treat A as the circle instead.
     *  @returns {Vector2} The minimum translation vector to apply to A. */
    static #findCompletelyOverlappingRectToCircleMTV(a, b, flipped = false) {
        const bCenterPos = b.aabb.centerPos;
        const modifier = !flipped ? -1 : 1;
        const topLeftDiff = bCenterPos.subCopy(a.aabb.pos);
        const bottomRightDiff = a.aabb.maxPos.sub(bCenterPos);
        const topLeftMTV = topLeftDiff.x < topLeftDiff.y ? new Vector2(-topLeftDiff.x - b.radius, 0) : new Vector2(0, -topLeftDiff.y - b.radius);
        const bottomRightMTV = bottomRightDiff.x < bottomRightDiff.y ? new Vector2(bottomRightDiff.x + b.radius, 0) : new Vector2(0, bottomRightDiff.y + b.radius);
        return topLeftMTV.magnitude() < bottomRightMTV.magnitude() ? topLeftMTV.mulScalar(modifier) : bottomRightMTV.mulScalar(modifier);
    }

    /** Finds an MTV to resolve collision between a rectangle and circle collider.
     *  @param {RectangleCollider} a - The first.
     *  @param {CircleCollider} b - The second.
     *  @param {boolean} flipped - Whether to treat A as the circle instead.
     *  @returns {Vector2} The minimum translation vector to apply to A. */
    static findRectToCircleMTV(a, b, flipped = false) {
        const bCenterPos = b.aabb.centerPos;
        if (!this.checkRectToCircleCollides(a, b)) return new Vector2(0, 0);

        const mtv = a.aabb.pos
            .add(a.aabb.dimensions)
            .select(bCenterPos, true, true)
            .select(a.aabb.pos, false, false)
            .sub(bCenterPos);
        const distance = mtv.magnitude();

        if (distance === 0) return this.#findCompletelyOverlappingRectToCircleMTV(a, b, flipped);
        const scalar = !flipped ? -distance + b.radius : distance - b.radius
        return mtv.normalize().mulScalar(scalar);
    }

    /** Finds an MTV to resolve collision between moving rectangle and circle colliders.
     *  @param {RectangleCollider} a - The first (treated as moving).
     *  @param {CircleCollider} b - The second.
     *  @param {boolean} flipped - Whether to treat A as the circle instead.
     *  @returns {Vector2} The minimum translation vector to apply to A. */
    static findSweptRectToCircleMTV(a, b, flipped = false) {
        let mtv = this.findRectToCircleMTV(a, b, flipped);
        if (!mtv.isZero()) return mtv;

        const result = this.checkSweptRectToCircleCollides(a, b, flipped);
        if (result === null) return new Vector2(0, 0);
        return !flipped ? result.contactPoint.sub(a.aabb.centerPos) : result.contactPoint.sub(b.aabb.centerPos);
    }

    /** Checks for a collision between two colliders.
     *  @param {Collider} a - The first.
     *  @param {Collider} b - The second.
     *  @returns {ColliderResult | null} The result. */
    static checkSweptCollides(a, b) {
        const aIsRect = RectangleCollider.prototype.isPrototypeOf(a);
        const bIsRect = RectangleCollider.prototype.isPrototypeOf(b);
        const aIsCircle = CircleCollider.prototype.isPrototypeOf(a);
        const bIsCircle = CircleCollider.prototype.isPrototypeOf(b);

        if (aIsRect && bIsRect) return this.checkSweptRectToRectCollides(a, b);
        if (aIsRect && bIsCircle) return this.checkSweptRectToCircleCollides(a, b);
        if (aIsCircle && bIsRect) return this.checkSweptRectToCircleCollides(b, a, true);
        if (aIsCircle && bIsCircle) return this.checkSweptCircleToCircleCollides(a, b);
        return null;
    }

    /** Finds an MTV to resolve collision between two colliders.
     *  @param {Collider} a - The first. 
     *  @param {Collider} b - The second.
     *  @returns {Vector2} The minimum translation vector to apply to A. */
    static findMTV(a, b) {
        const aIsRect = RectangleCollider.prototype.isPrototypeOf(a);
        const bIsRect = RectangleCollider.prototype.isPrototypeOf(b);
        const aIsCircle = CircleCollider.prototype.isPrototypeOf(a);
        const bIsCircle = CircleCollider.prototype.isPrototypeOf(b);

        if (aIsRect && bIsRect) return this.findSweptRectToRectMTV(a, b);
        if (aIsRect && bIsCircle) return this.findSweptRectToCircleMTV(a, b);
        if (aIsCircle && bIsRect) return this.findSweptRectToCircleMTV(b, a, true);
        if (aIsCircle && bIsCircle) return this.findSweptCircleToCircleMTV(a, b);
        return new Vector2(0, 0);
    }
}

export default ColliderResolver;
