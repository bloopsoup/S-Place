import { Vector2 } from '../../common/index.js';

/** A rectangle that bundles position and dimension data.
 *  @memberof Components.Physics */
class Rectangle {
    /** @type {Vector2} */
    #dimensions
    /** @type {Vector2} */
    #halfDimensions
    /** @type {Vector2} */
    #oldPos
    /** @type {Vector2} */
    #pos

    /** Create the rectangle.
     *  @param {Vector2} dimensions - The dimensions of the rectangle. 
     *  @param {Vector2} pos - The position of the rectangle. */
    constructor(dimensions, pos) {
        this.#dimensions = dimensions;
        this.#halfDimensions = dimensions.copy().mulScalar(0.5);
        this.#oldPos = pos;
        this.#pos = pos.copy();
    }

    /** Get the dimensions.
     *  @return {Vector2} The dimensions. */
    get dimensions() { return this.#dimensions; }

    /** Get the half-dimensions.
     *  @return {Vector2} The half-dimensions. */
    get halfDimensions() { return this.#halfDimensions; }

    /** Get the old position. This is used with the current position
     *  to calculate direction, making it useful for tile-based collisions.
     *  @return {Vector2} The old position. */
    get oldPos() { return this.#oldPos; }

    /** Get the current position.
     *  @return {Vector2} The current position. */
    get pos() { return this.#pos; }

    /** Get the old center of the rectangle.
     *  @return {Vector2} The old center. */
    get oldCenterPos() { return this.#oldPos.addCopy(this.#halfDimensions); }

    /** Get the center of the rectangle.
     *  @return {Vector2} The center. */
    get centerPos() { return this.#pos.addCopy(this.#halfDimensions); }

    /** Get the old position of the rectangle's bottom right corner.
     *  @return {Vector2} The old position of the bottom right corner. */
    get oldMaxPos() { return this.#oldPos.addCopy(this.#dimensions); }

    /** Get the position of the rectangle's bottom right corner.
     *  @return {Vector2} The position of the bottom right corner. */
    get maxPos() { return this.#pos.addCopy(this.#dimensions); }

    /** Sets the position.
     *  @param {Vector2} pos - The new position. */
    set pos(pos) {
        this.#pos.copyTo(this.#oldPos);
        pos.copyTo(this.#pos);
    }

    /** Update the old position and increment the current position.
     *  @param {Vector2} pos - The increment. */
    incrementPos(pos) {
        this.#pos.copyTo(this.#oldPos);
        this.#pos.add(pos); 
    }

    /** Gets the interpolated position.
     *  @param {number} alpha - Used for interpolation when rendering between two states. */
    interpolatePos(alpha) { return this.#oldPos.blend(this.#pos, alpha); }
}

export default Rectangle;
