import Input from './input.js';

export default class InputHandler {
    /** Handles all keyboard and mouse inputs. */

    acceptedInputNames = ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Enter', 'MouseHold'];

    constructor() {
        this.inputs = {};
        window.addEventListener('keydown', e => this.addInput(e.key));
        window.addEventListener('keyup', e => this.removeInput(e.key));
        window.addEventListener('mousedown', e => this.addInput('MouseHold', [e.clientX, e.clientY]));
        window.addEventListener('mouseup', _ => this.removeInput('MouseHold'));
    }

    getInputs() { return this.inputs; }
    addInput(inputName, pos = null) {  
        if (this.acceptedInputNames.includes(inputName) & !(inputName in this.inputs))
            this.inputs[inputName] = new Input(inputName, pos);
    }
    removeInput(inputName) {
        if (this.acceptedInputNames.includes(inputName))
            delete this.inputs[inputName];
    }
}
