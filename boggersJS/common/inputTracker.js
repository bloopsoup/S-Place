import Input from './input.js';
import Vector2 from './vector2.js';

/** Stores many inputs and is the object that is passed from the InputManager.
 *  Has methods to check for the presence of specific inputs or getting an
 *  input of a certain type.
 *  @memberof Common */
class InputTracker {
    /** @type {Object<string, Input>} */
    #inputs

    /** Create the InputTracker. */
    constructor() { this.#inputs = {}; }

    /** Checks whether the tracker has the requested input.
     *  @param {string} name - The name of the input. 
     *  @returns {boolean} The result. */
    has(name) { return name in this.#inputs; }

    /** Add an input.
     *  @param {string} name - The name of the input.
     *  @param {Vector2} pos - The mouse position of the input. */
    add(name, pos) {
        this.#inputs[name] = new Input(name, pos);
        if (name === 'MouseMove' && 'MouseHold' in this.#inputs)
            this.#inputs['MouseHold'] = new Input('MouseHold', pos);
    }

    /** Remove an input.
     *  @param {string} name - The name of the input to remove. */
    remove(name) { delete this.#inputs[name]; }

    /** Removes a printable input from tracking and returns it. This will return 
     *  null if no printable input is found.
     *  @returns {Input | null} The result. */
    consumePrintableInput() {
        const printable = Object.keys(this.#inputs).find(i => i.length === 1);
        return printable ? this.#inputs[printable] : null;
    }
}

export default InputTracker;
