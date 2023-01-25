import Vector2 from './vector2.js';

export default class Input {
    /** Stores input related information that is managed by an InputHandler. */

    /** @type {string} The name of the input. */
    #name
    /** @type {Vector2} The mouse position of the input. */
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

    /** Creates a copy of the input.
     *  @returns {Input} The copy of the original input. */
    copy() { return new Input(this.#name, this.#pos.copy()); }
}
