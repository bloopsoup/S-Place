export default class Vector2 {
    /** A two element vector which supports various non-standard operations.
     * 
     *  Classes which keep track of Vector2 objects (like for position data)
     *  should use the copy functions when making vector data accessible via 
     *  getters to prevent unwanted/outside changes. */

    /** @type {number} The x value. */
    #x
    /** @type {number} The y value. */
    #y

    /** Create a two element vector.
     *  @param {number} x - The x value. 
     *  @param {number} y - The y value. */
    constructor(x, y) {
        this.#x = x;
        this.#y = y;
    }

    /** Get the x value.
     *  @return {number} The x value. */
    get x() { return this.#x; }

    /** Get the y value.
     *  @return {number} The y value. */
    get y() { return this.#y; }

    /** Sets the x value.
     *  @param {number} x - The x value. */
    set x(x) { this.#x = x; }

    /** Sets the y value.
     *  @param {number} y - The y value. */
    set y(y) { this.#y = y; }

    /** Add to the x value.
     *  @param {number} x - The x value to add. */
    addToX(x) { this.#x += x; }

    /** Make a copy and add to the x value.
     *  @param {number} x - The x value to add.
     *  @return {Vector2} The result. */
    addToXCopy(x) { return new Vector2(this.#x + x, this.#y); }

    /** Add to the y value.
     *  @param {number} y - The y value to add. */
    addToY(y) { this.#y += y; }

    /** Make a copy and add to the y value.
     *  @param {number} y - The y value to add.
     *  @return {Vector2} The result. */
    addToYCopy(y) { return new Vector2(this.#x, this.#y + y); }

    /** Add a vector to this vector element-wise. 
     *  @param {Vector2} other - The vector to add to this vector. */
    add(other) { 
        this.#x += other.#x; 
        this.#y += other.#y; 
    }

    /** Make a copy and add a vector to it.
     * @param {Vector2} other - The vector to add to the copy.
     * @returns {Vector2} The result. */
    addCopy(other) { return new Vector2(this.#x + other.#x, this.#y + other.#y); }

    /** Subtract a vector from this vector element-wise. 
     *  @param {Vector2} other - The vector to subtract from this vector. */
    sub(other) {
        this.#x -= other.#x;
        this.#y -= other.#y;
    }

    /** Make a copy and subtract a vector from it.
     * @param {Vector2} other - The vector to subtract from the copy.
     * @returns {Vector2} The result. */
    subCopy(other) { return new Vector2(this.#x - other.#x, this.#y - other.#y); }

    /** Multiply a vector to this vector element-wise. 
     *  @param {Vector2} other - The vector to multiply to this vector. */
    mul(other) {
        this.#x *= other.#x;
        this.#y *= other.#y;
    }

    /** Make a copy and multiply it with a vector.
     * @param {Vector2} other - The vector to multiply with the copy.
     * @returns {Vector2} The result. */
    mulCopy(other) { return new Vector2(this.#x * other.#x, this.#y * other.#y); }

    /** Floor divide this vector by a vector element-wise. 
     *  @param {Vector2} other - The vector that this vector is floor divided by. */
    floorDiv(other) {
        this.#x /= other.#x;
        this.#x = Math.floor(this.#x);
        this.#y /= other.#y;
        this.#y = Math.floor(this.#y);
    }

    /** Make a copy and floor divide it by a vector.
     *  @param {Vector2} other - The vector that the copy is floor divided by.
     *  @returns {Vector2} The result. */
    floorDivCopy(other) { return new Vector2(Math.floor(this.#x / other.#x), Math.floor(this.#y / other.#y)); }
    
    /** Return a copy of this vector.
     *  @returns {Vector2} The copy. */
    copy() { return new Vector2(this.#x, this.#y); }

    /** Checks element-wise if this vector is less than the other vector.
     *  @param {Vector2} other - The other vector that is being compared to.
     *  @returns {boolean} The result. */
    lessThan(other) { return this.#x < other.#x && this.#y < other.#y; }

    /** Checks element-wise if this vector is equal to the other vector.
     *  @param {Vector2} other - The other vector that is being compared to.
     *  @returns {boolean} The result. */
    equals(other) { return this.#x === other.#x && this.#y === other.#y; }

    /** Sets this vector's elements to the maximum/minimum of this vector's elements 
     *  and another vector's elements. The maximum/minimum is done per element.
     *  @param {Vector2} other - The other vector.
     *  @param {boolean} useMinA - Whether to take the minimum of the x values from both vectors.
     *  @param {boolean} useMinB - Whether to take the minimum of the y values from both vectors. */
    select(other, useMinA, useMinB) {
        const selectX = useMinA ? Math.min : Math.max;
        const selectY = useMinB ? Math.min : Math.max;
        this.#x = selectX(this.#x, other.#x);
        this.#y = selectY(this.#y, other.#y);
    }
}
