export default class Collider {
    /** Handles buffered and instant collisions between two Movable objects. */

    #currentTicks
    #intangibilityTicks

    constructor(intangibilityTicks) {
        this.#currentTicks = 0; 
        this.#intangibilityTicks = intangibilityTicks;
    }

    overlaps(a, b) {
        return a.pos.lessThan(b.pos.addCopy(b.dimensions)) && b.pos.lessThan(a.pos.addCopy(a.dimensions));
    }

    collides(a, b, buffered) {
        if (this.#currentTicks > 0) this.#currentTicks--;
        if (!this.overlaps(a, b)) return false;
        if (!buffered) return true;
        if (this.#currentTicks == 0) { this.#currentTicks = this.#intangibilityTicks; return true; } 
        return false;
    }
}
