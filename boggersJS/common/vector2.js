export default class Vector2 {
    /** A two element vector. Amazing. */

    #x
    #y

    constructor(x, y) {
        this.#x = x;
        this.#y = y;
    }

    get x() { return this.#x; }
    get y() { return this.#y; }

    set x(x) { this.#x = x; }
    set y(y) { this.#y = y; }

    addToX(x) { this.#x += x; }
    addToY(y) { this.#y += y; }
    add(other) { 
        this.#x += other.#x; 
        this.#y += other.#y; 
    }
    sub(other) {
        this.#x -= other.#x;
        this.#y -= other.#y;
    }
    mul(other) {
        this.#x *= other.#x;
        this.#y *= other.#y;
    }
    floorDiv(other) {
        this.#x /= other.#x;
        this.#x = Math.floor(this.#x);
        this.#y /= other.#y;
        this.#y = Math.floor(this.#y);
    }
    select(other, useMinA, useMinB) {
        const selectX = useMinA ? Math.min : Math.max;
        const selectY = useMinB ? Math.min : Math.max;
        this.#x = selectX(this.#x, other.#x);
        this.#y = selectY(this.#y, other.#y);
    }

    lessThan(other) { return this.#x < other.#x && this.#y < other.#y; }
    equals(other) { return this.#x === other.#x && this.#y === other.#y; }

    addToXCopy(x) { return new Vector2(this.#x + x, this.#y); }
    addToYCopy(y) { return new Vector2(this.#x, this.#y + y); }
    addCopy(other) { return new Vector2(this.#x + other.#x, this.#y + other.#y); }
    subCopy(other) { return new Vector2(this.#x - other.#x, this.#y - other.#y); }
    mulCopy(other) { return new Vector2(this.#x * other.#x, this.#y * other.#y); }
    floorDivCopy(other) { return new Vector2(Math.floor(this.#x / other.#x), Math.floor(this.#y / other.#y)); }
    copy() { return new Vector2(this.#x, this.#y); }
}
