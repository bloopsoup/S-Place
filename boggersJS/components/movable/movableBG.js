import Movable from './movable.js';
import { Vector2 } from '../../common/index.js';

/** Meant for moving backgrounds. Provides methods for determining starting positions
 *  and "next" positions such that backgrounds can be spliced together. 
 *  @augments Movable 
 *  @memberof Components.Movable */
class MovableBG extends Movable {
    /** @type {Vector2} */
    #startPos
    /** @type {Vector2} */
    #nextPos

    /** Create the MovableBG.
     *  @param {Vector2} maxDimensions - Assuming the origin is (0, 0), limits how far the background can scroll. 
     *  @param {Vector2} dimensions - The dimensions of the Movable.
     *  @param {Vector2} velocity - The speed and cardinal direction that a background should scroll. */
    constructor(maxDimensions, dimensions, velocity) {
        super(maxDimensions, dimensions, new Vector2(0, 0), velocity, new Vector2(0, 0), new Vector2(0, 0), new Vector2(0, 0));
        this.#startPos = new Vector2(this.velocity.x <= 0 ? 0 : this.maxDimensions.x - this.dimensions.x,
                                     this.velocity.y <= 0 ? 0 : this.maxDimensions.y - this.dimensions.y);
        this.#nextPos = new Vector2(0, 0);
        this.resetPos();
    }

    /** Gets the next position to draw a copy of the background to make the looping seemless.
     *  @return {Vector2} - The next position to draw the copy. */
    get nextPos() {
        this.#nextPos.setBoth((this.velocity.x >= 0 ? -1 : 1) * (this.velocity.x === 0 ? 0 : 1), 
                              (this.velocity.y >= 0 ? -1 : 1) * (this.velocity.y === 0 ? 0 : 1));
        this.#nextPos.mul(this.dimensions);
        this.#nextPos.add(this.pos);
        this.#nextPos.add(this.velocity);
        return this.#nextPos;
    }

    /** Sets the background's position to the starting position.
     *  Used when the background is completely out of bounds. */
    resetPos() { this.#startPos.copyTo(this.pos); }

    /** Increments the background position and resets the position if needed. */
    update() {
        this.incrementPos();
        if (this.outOfBoundsComplete()) this.resetPos();   
    }
}

export default MovableBG;
