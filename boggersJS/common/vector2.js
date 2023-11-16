/** A two element vector which supports various non-standard operations.
 * 
 *  Classes which keep track of Vector2 objects (like for position data)
 *  should use the copy functions when making vector data accessible. This 
 *  is to prevent unwanted/outside changes. 
 *  @memberof Common */
class Vector2 {
    /** @type {number} */
    #x
    /** @type {number} */
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

    /** Gets the max of the x and y values.
     *  @returns {number} The max. */
    max() { return Math.max(this.#x, this.#y); }

    /** Gets the min of the x and y values.
     *  @returns {number} The min. */
    min() { return Math.min(this.#x, this.#y); }

    /** Sets both the x and y values.
     *  @param {number} x - The x value.
     *  @param {number} y - The y value. */
    setBoth(x, y) { 
        this.#x = x; 
        this.#y = y; 
    }

    /** Swaps the x and y values. */
    swap() {
        const tmp = this.#x;
        this.#x = this.#y;
        this.#y = tmp;
    }

    /** Add to the x value.
     *  @param {number} x - The x value to add.
     *  @returns {Vector2} The vector itself for chaining. */
    addToX(x) { 
        this.#x += x;
        return this;
    }

    /** Make a copy and add to the x value.
     *  @param {number} x - The x value to add.
     *  @return {Vector2} The result. */
    addToXCopy(x) { return new Vector2(this.#x + x, this.#y); }

    /** Add to the y value.
     *  @param {number} y - The y value to add.
     *  @returns {Vector2} The vector itself for chaining. */
    addToY(y) { 
        this.#y += y;
        return this;
    }

    /** Make a copy and add to the y value.
     *  @param {number} y - The y value to add.
     *  @return {Vector2} The result. */
    addToYCopy(y) { return new Vector2(this.#x, this.#y + y); }

    /** Add to both the x and y values.
     *  @param {number} x - The x value to add.
     *  @param {number} y - The y value to add.
     *  @returns {Vector2} The vector itself for chaining. */
    addToBoth(x, y) {
        this.#x += x;
        this.#y += y;
        return this;
    }

    /** Add a vector to this vector element-wise. 
     *  @param {Vector2} other - The vector to add to this vector.
     *  @returns {Vector2} The vector itself for chaining. */
    add(other) { 
        this.#x += other.#x; 
        this.#y += other.#y;
        return this;
    }

    /** Make a copy and add a vector to it.
     * @param {Vector2} other - The vector to add to the copy.
     * @returns {Vector2} The result. */
    addCopy(other) { return new Vector2(this.#x + other.#x, this.#y + other.#y); }

    /** Subtract a vector from this vector element-wise. 
     *  @param {Vector2} other - The vector to subtract from this vector.
     *  @returns {Vector2} The vector itself for chaining. */
    sub(other) {
        this.#x -= other.#x;
        this.#y -= other.#y;
        return this;
    }

    /** Make a copy and subtract a vector from it.
     * @param {Vector2} other - The vector to subtract from the copy.
     * @returns {Vector2} The result. */
    subCopy(other) { return new Vector2(this.#x - other.#x, this.#y - other.#y); }

    /** Multiply a vector's elements by a scalar. 
     *  @param {number} scalar - The scalar.
     *  @returns {Vector2} The vector itself for chaining. */
    mulScalar(scalar) {
        this.#x *= scalar;
        this.#y *= scalar;
        return this;
    }

    /** Multiply a vector to this vector element-wise. 
     *  @param {Vector2} other - The vector to multiply to this vector.
     *  @returns {Vector2} The vector itself for chaining. */
    mul(other) {
        this.#x *= other.#x;
        this.#y *= other.#y;
        return this;
    }

    /** Make a copy and multiply it with a vector.
     *  @param {Vector2} other - The vector to multiply with the copy.
     *  @returns {Vector2} The result. */
    mulCopy(other) { return new Vector2(this.#x * other.#x, this.#y * other.#y); }

    /** Divide a vector's elements by a scalar. 
     *  @param {number} scalar - The scalar.
     *  @returns {Vector2} The vector itself for chaining. */
    divScalar(scalar) {
        this.#x /= scalar;
        this.#y /= scalar;
        return this;
    }

    /** Divide this vector by a vector element-wise. 
     *  @param {Vector2} other - The vector that this vector is divided by.
     *  @returns {Vector2} The vector itself for chaining. */
    div(other) {
        this.#x /= other.#x;
        this.#y /= other.#y;
        return this;
    }

    /** Make a copy and divide it by a vector.
     *  @param {Vector2} other - The vector that the copy is divided by.
     *  @returns {Vector2} The result. */
    divCopy(other) { return new Vector2(this.#x / other.#x, this.#y / other.#y); }

    /** Floor divide a vector's elements by a scalar. 
     *  @param {number} scalar - The scalar.
     *  @returns {Vector2} The vector itself for chaining. */
    floorDivScalar(scalar) {
        this.#x /= scalar;
        this.#x = Math.floor(this.#x);
        this.#y /= scalar;
        this.#y = Math.floor(this.#y);
        return this;
    }

    /** Floor divide this vector by a vector element-wise. 
     *  @param {Vector2} other - The vector that this vector is floor divided by.
     *  @returns {Vector2} The vector itself for chaining. */
    floorDiv(other) {
        this.#x /= other.#x;
        this.#x = Math.floor(this.#x);
        this.#y /= other.#y;
        this.#y = Math.floor(this.#y);
        return this;
    }

    /** Make a copy and floor divide it by a vector.
     *  @param {Vector2} other - The vector that the copy is floor divided by.
     *  @returns {Vector2} The result. */
    floorDivCopy(other) { return new Vector2(Math.floor(this.#x / other.#x), Math.floor(this.#y / other.#y)); }

    /** Take the absolute values of the vector.
     *  @returns {Vector2} The vector itself for chaining. */
    abs() {
        this.#x = Math.abs(this.#x);
        this.#y = Math.abs(this.#y);
        return this;
    }

    /** Make a copy and take the absolute values.
     *  @returns {Vector2} The result. */
    absCopy() { return new Vector2(Math.abs(this.#x), Math.abs(this.#y)); }

    /** Checks element-wise if this vector is less than the other vector.
     *  @param {Vector2} other - The other vector that is being compared to.
     *  @returns {boolean} The result. */
    lessThan(other) { return this.#x < other.#x && this.#y < other.#y; }

    /** Checks if at least one element of this vector is less than the corresponding 
     *  element of the other vector.
     *  @param {Vector2} other - The other vector that is being compared to.
     *  @returns {boolean} The result. */
    anyLessThan(other) { return this.#x < other.#x || this.#y < other.#y; }

    /** Checks element-wise if this vector is more than the other vector.
     *  @param {Vector2} other - The other vector that is being compared to.
     *  @returns {boolean} The result. */
    greaterThan(other) { return this.#x > other.#x && this.#y > other.#y; }

    /** Checks if at least one element of this vector is greater than the corresponding 
     *  element of the other vector.
     *  @param {Vector2} other - The other vector that is being compared to.
     *  @returns {boolean} The result. */
    anyGreaterThan(other) { return this.#x > other.#x || this.#y > other.#y; }

    /** Checks element-wise if this vector is equal to the other vector.
     *  @param {Vector2} other - The other vector that is being compared to.
     *  @returns {boolean} The result. */
    equals(other) { return this.#x === other.#x && this.#y === other.#y; }

    /** Sets this vector's elements to the maximum/minimum of this vector's elements 
     *  and another vector's elements. The maximum/minimum is done per element.
     *  @param {Vector2} other - The other vector.
     *  @param {boolean} useMinA - Whether to take the minimum of the x values from both vectors.
     *  @param {boolean} useMinB - Whether to take the minimum of the y values from both vectors.
     *  @returns {Vector2} The vector itself for chaining. */
    select(other, useMinA, useMinB) {
        const selectX = useMinA ? Math.min : Math.max;
        const selectY = useMinB ? Math.min : Math.max;
        this.#x = selectX(this.#x, other.#x);
        this.#y = selectY(this.#y, other.#y);
        return this;
    }

    /** The same as select except the other vector is the zero vector.
     *  @param {boolean} useMinA - Whether to take the minimum of the x values from both vectors.
     *  @param {boolean} useMinB - Whether to take the minimum of the y values from both vectors.
     *  @returns {Vector2} The vector itself for chaining. */
    selectWithZero(useMinA, useMinB) {
        const selectX = useMinA ? Math.min : Math.max;
        const selectY = useMinB ? Math.min : Math.max;
        this.#x = selectX(this.#x, 0);
        this.#y = selectY(this.#y, 0);
        return this;
    }

    /** Sets this vector's elements to the other vector's elements if the
     *  current element is 0.
     *  @param {Vector2} other - The other vector.
     *  @returns {Vector2} The vector itself for chaining. */
    selectIfZero(other) {
        this.#x = (this.#x === 0) ? other.#x : this.#x;
        this.#y = (this.#y === 0) ? other.#y : this.#y;
        return this;
    }

    /** Checks if both elements in the vector are zero.
     *  @returns {boolean} The result. */
    isZero() { return this.#x === 0 && this.#y === 0; }

    /** Checks if either element in the vector is negative.
     *  @return {boolean} The result. */
    isNegative() { return this.#x < 0 || this.#y < 0; }

    /** Gets the vector's magnitude.
     *  @returns {number} The magnitude. */
    magnitude() { return Math.sqrt(Math.pow(this.#x, 2) + Math.pow(this.#y, 2)); }

    /** Normalize this vector.
     *  @returns {Vector2} The vector itself for chaining. */
    normalize() {
        const norm = Math.sqrt(Math.pow(this.#x, 2) + Math.pow(this.#y, 2));
        this.#x /= norm;
        this.#y /= norm;
        return this;
    }

    /** Returns the angle represented by the vector.
     *  @returns {number} The angle in radians. */
    toAngle() { return Math.atan2(this.#y, this.#x); }

    /** Calculate the dot product between this and the other vector.
     *  @param {Vector2} other - The other vector. 
     *  @returns {number} The dot product. */
    dotProduct(other) { return (this.#x * other.#x) + (this.#y * other.#y); }

    /** Blend this vector with another. A convenience function used for interpolation.
     *  @param {Vector2} other - The other vector.
     *  @param {number} alpha - The blending factor which is in [0, 1].
     *  @return {Vector2} The result. */
    blend(other, alpha) {
        const aX = this.#x * (1 - alpha), aY = this.#y * (1 - alpha);
        const bX = other.#x * alpha, bY = other.#y * alpha;
        return new Vector2(aX + bX, aY + bY);
    }

    /** Return a copy of this vector.
     *  @returns {Vector2} The copy. */
    copy() { return new Vector2(this.#x, this.#y); }

    /** Copies this vector's numbers to the other vector.
     *  @param {Vector2} other - The other vector. */
    copyTo(other) {
        other.#x = this.#x;
        other.#y = this.#y;
    }
}

export default Vector2;
