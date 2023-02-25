import Vector2 from './vector2.js';

/** Stores input related information that is managed by an InputTracker.
 *  @memberof Common */
class Input {
    /** @type {string} */
    #name
    /** @type {Vector2} */
    #oldPos
    /** @type {Vector2} */
    #pos

    /** Create a new input object.
     *  @param {string} name - The name of the input.
     *  @param {Vector2} pos - The mouse position of the input. */
    constructor(name, pos) {
        this.#name = name;
        this.#oldPos = pos;
        this.#pos = pos.copy();
    }

    /** Get the input name.
     *  @return {string} The input name. */
    get name() { return this.#name; }

    /** Get the input's mouse position.
     *  @return {Vector2} The input's mouse position. */
    get pos() { return this.#pos; }

    /** Sets the offset to the input's mouse position. 
     *  @param {Vector2} offset - The offset. */
    set offset(offset) {
        this.#oldPos.copyTo(this.#pos);
        this.#pos.sub(offset);
    }
}

export default Input;
