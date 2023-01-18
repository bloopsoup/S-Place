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

    add(other) { 
        this.#x += other.#x; 
        this.#y += other.#y; 
    }
    mul(other) {
        this.#x *= other.#x;
        this.#y *= other.#y;
    }
    select(other, useMinA, useMinB) {
        const selectX = useMinA ? Math.min : Math.max;
        const selectY = useMinB ? Math.min : Math.max;
        this.#x = selectX(this.#x, other.#x);
        this.#y = selectY(this.#y, other.#y);
    }

    addCopy(other) { return new Vector2(this.#x + other.#x, this.#y + other.#y); }
    mulCopy(other) { return new Vector2(this.#x * other.#x, this.#y * other.#y); }
    copy() { return new Vector2(this.#x, this.#y); }
}
