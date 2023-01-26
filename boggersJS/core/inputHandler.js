import Vector2 from '../common/vector2.js';
import Input from '../common/input.js';

class InputHandler {
    /** Handles all keyboard and mouse inputs through event listeners. */

    /** @type {Array<string>} */
    #acceptedNames = ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Enter', 'MouseHold'];
    /** @type {Object.<string, Input>} */
    #inputs

    /** Create the InputHandler and register event listeners for keyboard and mouse inputs. */
    constructor() {
        this.#inputs = {};
        window.addEventListener('keydown', e => this.addInput(e.key));
        window.addEventListener('keyup', e => this.removeInput(e.key));
        window.addEventListener('mousedown', e => this.addInput('MouseHold', new Vector2(e.clientX, e.clientY)));
        window.addEventListener('mouseup', _ => this.removeInput('MouseHold'));
    }

    /** Get a copy of the InputHandler's currently tracked inputs.
     *  @return {Object.<string, Input>} A copy of the InputHandler's currently tracked inputs. */
    get inputs() {
        const inputs = {};
        for (let name in this.#inputs)
            inputs[name] = this.#inputs[name].copy();
        return inputs;
    }

    /** Add an input to the handler's currently tracked inputs.
     *  @param {string} name - The name of the input.
     *  @param {Vector2} pos - The mouse position of the input. */
    addInput(name, pos = new Vector2(0, 0)) {
        if (this.#acceptedNames.includes(name) && !(name in this.#inputs))
            this.#inputs[name] = new Input(name, pos);
    }

    /** Remove an input from the handler's currently tracked inputs.
     *  @param {string} name - The name of the input to remove. */
    removeInput(name) {
        if (this.#acceptedNames.includes(name))
            delete this.#inputs[name];
    }
}

export default InputHandler;
