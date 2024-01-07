import Vector2 from './vector2.js';

/** Stores input related information that is managed by an InputTracker.
 *  @memberof Common */
class Input {
    /** @type {string} */
    #name
    /** @type {Vector2} */
    #basePos
    /** @type {Vector2} */
    #offset

    /** Create a new input object.
     *  @param {string} name - The name of the input.
     *  @param {Vector2} pos - The mouse position of the input. */
    constructor(name, pos) {
        this.#name = name;
        this.#basePos = pos;
        this.#offset = new Vector2(0, 0);
    }

    /** Get the input name.
     *  @returns {string} The input name. */
    get name() { return this.#name; }

    /** Get the input mouse's base position.
     *  @returns {Vector2} The input's base position. */
    get basePos() { return this.#basePos.copy(); }

    /** Get the input's mouse position with offsets applied.
     *  @returns {Vector2} The input's mouse position. */
    get pos() { return this.#basePos.subCopy(this.#offset); }

    /** Sets the base position. This overwrites any offset
     *  being applied.
     *  @param {Vector2} pos - The new position. */
    set basePos(pos) { this.#basePos = pos; }

    /** Sets the offset to the input's mouse position. 
     *  @param {Vector2} offset - The offset. */
    set offset(offset) { this.#offset = offset; }
}

export default Input;
