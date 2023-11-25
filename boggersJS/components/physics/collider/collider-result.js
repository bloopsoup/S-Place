import { Vector2 } from '../../../common/index.js';

/** A data class detailing information from a ray hit.
 *  @memberof Components.Physics.Collider */
class ColliderResult {
    /** @type {Vector2} */
    #contactPoint
    /** @type {Vector2} */
    #contactNormal
    /** @type {number} */
    #hitTime

    /** Create the collider result.
     *  @param {Vector2} contactPoint - The first point of contact. 
     *  @param {Vector2} contactNormal - The collision normal.
     *  @param {number} hitTime - The time of the nearest hit. */
    constructor(contactPoint, contactNormal, hitTime) {
        this.#contactPoint = contactPoint;
        this.#contactNormal = contactNormal;
        this.#hitTime = hitTime;
    }

    /** Gets the contact point. 
     *  @returns {Vector2} The contact point. */
    get contactPoint() { return this.#contactPoint.copy(); }

    /** Gets the contact normal. 
     *  @returns {Vector2} The normal. */
    get contactNormal() { return this.#contactNormal.copy(); }

    /** Gets the hit time.
     *  @returns {number} The hit time. */
    get hitTime() { return this.#hitTime; }
}

export default ColliderResult;
