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

    /** Gets an input from the tracker.
     *  @param {string} name - The name of the input.
     *  @returns {Input} The input. */
    get(name) { return this.#inputs[name]; }

    /** Add an input.
     *  @param {string} name - The name of the input.
     *  @param {Vector2} pos - The mouse position of the input. */
    add(name, pos) {
        if (name in this.#inputs) pos.copyTo(this.#inputs[name].pos);
        else this.#inputs[name] = new Input(name, pos);
        if (name === 'MouseMove' && 'MouseHold' in this.#inputs)
            this.#inputs['MouseHold'] = new Input('MouseHold', pos);
    }

    /** Remove an input.
     *  @param {string} name - The name of the input to remove. */
    remove(name) { delete this.#inputs[name]; }

    /** Removes the specified input and returns a boolean indicating
     *  if the input was originally being tracked. 
     *  @returns {boolean} The result. */
    consumeInput(name) {
        if (!(name in this.#inputs)) return false;
        this.remove(name);
        return true;
    }

    /** Removes a printable input from tracking and returns its name. This 
     *  will return null if no printable input is found.
     *  @returns {string | null} The result. */
    consumePrintableInput() {
        const printable = Object.keys(this.#inputs).find(i => i.length === 1);
        if (printable) this.remove(printable);
        return printable ? printable : null;
    }

    /** Apply an offset to the positions of all currently tracked inputs. 
     *  Used when working with Cameras. 
     *  @param {Vector2} offset - The offset to apply. */
    applyOffset(offset) {
        Object.keys(this.#inputs).forEach(key => this.#inputs[key].offset = offset);
    }
}

export default InputTracker;
