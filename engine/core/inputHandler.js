import Vector2 from '../common/vector2.js';
import Input from './input.js';

export default class InputHandler {
    /** Handles all keyboard and mouse inputs. */

    #acceptedNames = ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Enter', 'MouseHold'];
    #inputs

    constructor() {
        this.#inputs = {};
        window.addEventListener('keydown', e => this.addInput(e.key));
        window.addEventListener('keyup', e => this.removeInput(e.key));
        window.addEventListener('mousedown', e => this.addInput('MouseHold', new Vector2(e.clientX, e.clientY)));
        window.addEventListener('mouseup', _ => this.removeInput('MouseHold'));
    }

    get inputs() { return this.#inputs; }

    addInput(name, pos = null) {
        if (this.#acceptedNames.includes(name) & !(name in this.#inputs))
            this.#inputs[name] = new Input(name, pos);
    }
    removeInput(name) {
        if (this.#acceptedNames.includes(name))
            delete this.#inputs[name];
    }
}
