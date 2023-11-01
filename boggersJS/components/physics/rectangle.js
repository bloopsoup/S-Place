import { Vector2 } from '../../common/index.js';

/** A rectangle that bundles position and dimension data.
 *  @memberof Components.Physics */
class Rectangle {
    /** @type {Vector2} */
    #dimensions
    /** @type {Vector2} */
    #oldPos
    /** @type {Vector2} */
    #pos

    /** Create the rectangle.
     *  @param {Vector2} dimensions - The dimensions of the rectangle. 
     *  @param {Vector2} pos - The position of the rectangle. */
    constructor(dimensions, pos) {
        this.#dimensions = dimensions;
        this.#oldPos = pos;
        this.#pos = pos.copy();
    }

    /** Get the dimensions.
     *  @return {Vector2} The dimensions. */
    get dimensions() { return this.#dimensions; }

    /** Get the old position. This is used with the current position
     *  to calculate direction, making it useful for tile-based collisions.
     *  @return {Vector2} The old position. */
    get oldPos() { return this.#oldPos; }

    /** Get the current position.
     *  @return {Vector2} The current position. */
    get pos() { return this.#pos; }

    /** Get the position of the rectangle's top left corner.
     *  @return {Vector2} The position of the top left corner. */
    get topLeftPos() { return this.#pos; }

    /** Get the old position of the rectangle's top left corner.
     *  @return {Vector2} The old position of the top left corner. */
    get oldTopLeftPos() { return this.#oldPos; }

    /** Get the position of the rectangle's top right corner.
     *  @return {Vector2} The position of the top right corner. */
    get topRightPos() { return this.#pos.addToXCopy(this.#dimensions.x); }

    /** Get the old position of the rectangle's top right corner.
     *  @return {Vector2} The old position of the top right corner. */
    get oldTopRightPos() { return this.#oldPos.addToXCopy(this.#dimensions.x); }

    /** Get the position of the rectangle's bottom left corner.
     *  @return {Vector2} The position of the bottom left corner. */
    get bottomLeftPos() { return this.#pos.addToYCopy(this.#dimensions.y); }

    /** Get the old position of the rectangle's bottom left corner.
     *  @return {Vector2} The old position of the bottom left corner. */
    get oldBottomLeftPos() { return this.#oldPos.addToYCopy(this.#dimensions.y); }

    /** Get the position of the rectangle's bottom right corner.
     *  @return {Vector2} The position of the bottom right corner. */
    get bottomRightPos() { return this.#pos.addCopy(this.#dimensions); }
    
    /** Get the old position of the rectangle's bottom right corner.
     *  @return {Vector2} The old position of the bottom right corner. */
    get oldBottomRightPos() { return this.#oldPos.addCopy(this.#dimensions); }

    /** Get the positions of all corners. 
     *  @return {Array<Vector2>} The positions of all corners. */
    get corners() { return [this.topRightPos, this.topLeftPos, this.bottomLeftPos, this.bottomRightPos]; }

    /** Replace the current position with a new position. 
     *  @param {Vector2} pos - The new position. */
    replacePos(pos) {
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

    /** Checks if a position is within this rectangle.
     *  @param {Vector2} point - The point.
     *  @return {boolean} The result. */
    overlapsPoint(point) {
        const buffer = this.#pos.copy();
        buffer.add(this.#dimensions);
        return point.greaterThan(this.#pos) && point.lessThan(buffer);
    }

    /** Checks whether the other rectangle overlaps with this rectangle. 
     *  @param {Rectangle} other - The other rectangle.
     *  @return {boolean} The result. */
    overlapsRectangle(other) {
        const buffer = this.#pos.copy();
        buffer.add(this.#dimensions);
        if (!other.pos.lessThan(buffer)) return false;
        other.pos.copyTo(buffer);
        buffer.add(other.dimensions);
        return this.#pos.lessThan(buffer);
    }
}

export default Rectangle;
