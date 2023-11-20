import { Vector2 } from '../../common/index.js';

/** A rectangle that bundles position, dimension, and velocity.
 *  @memberof Components.Physics */
class Rectangle {
    /** @type {Vector2} */
    #dimensions
    /** @type {Vector2} */
    #halfDimensions
    /** @type {Vector2} */
    #prevPos
    /** @type {Vector2} */
    #pos
    /** @type {Vector2} */
    #velocity

    /** Create the rectangle.
     *  @param {Vector2} dimensions - The dimensions of the rectangle. 
     *  @param {Vector2} pos - The position of the rectangle.
     *  @param {Vector2} velocity - The initial velocity of the rectangle. */
    constructor(dimensions, pos, velocity = new Vector2(0, 0)) {
        this.#dimensions = dimensions;
        this.#halfDimensions = dimensions.copy().mulScalar(0.5);
        this.#prevPos = pos;
        this.#pos = pos.copy();
        this.#velocity = velocity;
    }

    /** Get the dimensions.
     *  @return {Vector2} The dimensions. */
    get dimensions() { return this.#dimensions; }

    /** Get the half-dimensions.
     *  @return {Vector2} The half-dimensions. */
    get halfDimensions() { return this.#halfDimensions; }

    /** Get the previous position. This is solely used for interpolation
     *  in rendering graphics.
     *  @return {Vector2} The previous position. */
    get prevPos() { return this.#prevPos; }

    /** Get the current position.
     *  @return {Vector2} The current position. */
    get pos() { return this.#pos; }

    /** Get the center of the rectangle.
     *  @return {Vector2} The center. */
    get centerPos() { return this.#pos.addCopy(this.#halfDimensions); }

    /** Get the position of the rectangle's bottom right corner.
     *  @return {Vector2} The position of the bottom right corner. */
    get maxPos() { return this.#pos.addCopy(this.#dimensions); }

    /** Gets the next position.
     *  @returns {Vector2} The next position. */
    get nextPos() { return this.#pos.addCopy(this.#velocity); }

    /** Gets the next center position.
     *  @returns {Vector2} The next center position. */
    get nextCenterPos() { return this.nextPos.add(this.#halfDimensions); }

    /** Gets the rectangle's velocity.
     *  This is the endpoint that the MOVER operates on.
     *  @returns {Vector2} The velocity. */
    get velocity() { return this.#velocity; }

    /** Sets the position.
     *  @param {Vector2} pos - The new position. */
    set pos(pos) { pos.copyTo(this.#pos); }

    /** Update the previous position and move the current position.
     *  @param {Vector2} pos - The new position. */
    movePos(pos) {
        this.#pos.copyTo(this.#prevPos);
        pos.copyTo(this.#pos);
    }

    /** Update the previous position and increment the current position by the current velocity. */
    incrementPos() {
        this.#pos.copyTo(this.#prevPos);
        this.#pos.add(this.#velocity); 
    }

    /** Gets the interpolated position.
     *  @param {number} alpha - Used for interpolation when rendering between two states. */
    interpolatePos(alpha) { return this.#prevPos.blend(this.#pos, alpha); }
}

export default Rectangle;
