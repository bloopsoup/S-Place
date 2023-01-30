import Vector2 from './vector2.js';

/** Stores input related information that is managed by an InputHandler
 *  @memberof Common */
class Input {
    /** @type {string} */
    #name
    /** @type {Vector2} */
    #pos

    /** Create a new input object.
     *  @param {string} name - The name of the input.
     *  @param {Vector2} pos - The mouse position of the input. */
    constructor(name, pos) {
        this.#name = name;
        this.#pos = pos;
    }

    /** Get the input name.
     *  @return {string} The input name. */
    get name() { return this.#name; }

    /** Get the input's mouse position.
     *  @return {Vector2} The input's mouse position. */
    get pos() { return this.#pos.copy(); }

    /** Apply an offset to the input's mouse position. 
     *  Used when working with Cameras. 
     *  @param {Vector2} offset - The offset to add. */
    applyOffset(offset) { this.#pos.sub(offset); }

    /** Creates a copy of the input.
     *  @returns {Input} The copy of the original input. */
    copy() { return new Input(this.#name, this.#pos.copy()); }
}

export default Input;
