import { Movable } from './movable/index.js';
import { Vector2 } from '../common/index.js';
import TickRunner from './tick-runner.js';

/** Handles buffered and instant collisions between two Movable objects.
 *  Buffered collisions have a cooldown which can be used to call collision 
 *  events not meant to trigger every frame. 
 *  @memberof Components */
class Collider {
    /** @type {boolean} */
    #intangible
    /** @type {TickRunner} */
    #runner

    /** Create a Collider.
     *  @param {number} intangibilityTicks - The cooldown period between buffered collisions. */
    constructor(intangibilityTicks) {
        this.#intangible = false;
        this.#runner = new TickRunner(intangibilityTicks, () => this.#intangible = false);
    }

    /** Checks if a position is within a Movable.
     *  @param {Movable} a - The Movable.
     *  @param {Vector2} b - The position to check.
     *  @returns {boolean} The result. */
    pointOverlaps(a, b) {
        const buffer = a.pos.copy();
        buffer.add(a.dimensions);
        return b.greaterThan(a.pos) && b.lessThan(buffer);
    }

    /** Check whether two Movables overlap each other.
     *  @param {Movable} a - The first Movable. 
     *  @param {Movable} b - The second Movable.
     *  @returns {boolean} The result. */
    overlaps(a, b) {
        const buffer = a.pos.copy();
        buffer.add(a.dimensions);
        if (!b.pos.lessThan(buffer)) return false;
        b.pos.copyTo(buffer);
        buffer.add(b.dimensions);
        return a.pos.lessThan(buffer);
    }

    /** Check whether a collision occurs between two Movables. This takes into account
     *  cooldowns for buffered collisions.
     *  @param {Movable} a - The first Movable.
     *  @param {Movable} b - The second Movable.
     *  @param {boolean} buffered - Whether the collision is buffered or instant. 
     *  @returns {boolean} The result. */
    collides(a, b, buffered) {
        if (!this.overlaps(a, b)) return false;
        if (!buffered) return true;
        if (!this.#intangible) { this.#intangible = true; return true; } 
        return false;
    }

    /** Toggles intangibility after a certain amount of time has passed. */
    update() { if (this.#intangible) this.#runner.update(); }
}

export default Collider;
