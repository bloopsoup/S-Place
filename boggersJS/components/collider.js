import { Movable } from './movable/index.js';

/** Handles buffered and instant collisions between two Movable objects.
 *  Buffered collisions have a cooldown which can be used to call collision 
 *  events not meant to trigger every frame. 
 *  @memberof Components */
class Collider {
    /** @type {number} */
    #currentTicks
    /** @type {number} */
    #intangibilityTicks

    /** Create a Collider.
     *  @param {number} intangibilityTicks - The cooldown period between buffered collisions. */
    constructor(intangibilityTicks) {
        this.#currentTicks = 0; 
        this.#intangibilityTicks = intangibilityTicks;
    }

    /** Check whether two Movables overlap each other.
     *  @param {Movable} a - The first Movable. 
     *  @param {Movable} b - The second Movable.
     *  @returns {boolean} The result. */
    overlaps(a, b) {
        return a.pos.lessThan(b.pos.addCopy(b.dimensions)) && b.pos.lessThan(a.pos.addCopy(a.dimensions));
    }

    /** Check whether a collision occurs between two Movables. This takes into account
     *  cooldowns for buffered collisions.
     *  @param {Movable} a - The first Movable.
     *  @param {Movable} b - The second Movable.
     *  @param {boolean} buffered - Whether the collision is buffered or instant. 
     *  @returns {boolean} The result. */
    collides(a, b, buffered) {
        if (this.#currentTicks > 0) this.#currentTicks--;
        if (!this.overlaps(a, b)) return false;
        if (!buffered) return true;
        if (this.#currentTicks == 0) { this.#currentTicks = this.#intangibilityTicks; return true; } 
        return false;
    }
}

export default Collider;
