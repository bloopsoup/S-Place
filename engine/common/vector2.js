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

    add(other) { 
        this.#x += other.#x; 
        this.#y += other.#y; 
    }

    copy() { return new Vector2(this.#x, this.#y); }
}
