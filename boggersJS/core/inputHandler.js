import { Input, Vector2 } from '../common/index.js';

/** Handles all keyboard and mouse inputs through event listeners. 
 *  @memberof Core */
class InputHandler {
    /** @type {Array<string>} */
    #acceptedNames = ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Enter', 'MouseHold'];
    /** @type {Vector2} */
    #canvasPos
    /** @type {Vector2} */
    #canvasDimensions
    /** @type {Object<string, Input>} */
    #inputs

    /** Create the InputHandler and register event listeners for keyboard and mouse inputs. 
     *  @param {Vector2} canvasPos - The position of the canvas. 
     *  @param {Vector2} canvasDimensions - The dimensions of the canvas. */
    constructor(canvasPos, canvasDimensions) {
        this.#canvasPos = canvasPos;
        this.#canvasDimensions = canvasDimensions;
        this.#inputs = {};
        window.addEventListener('keydown', e => this.addInput(e.key));
        window.addEventListener('keyup', e => this.removeInput(e.key));
        window.addEventListener('mousedown', e => this.addInput('MouseHold', new Vector2(e.clientX, e.clientY)));
        window.addEventListener('mouseup', _ => this.removeInput('MouseHold'));
    }

    /** Get a copy of the InputHandler's currently tracked inputs.
     *  @return {Object<string, Input>} A copy of the InputHandler's currently tracked inputs. */
    get inputs() {
        const inputs = {};
        for (let name in this.#inputs)
            inputs[name] = this.#inputs[name].copy();
        return inputs;
    }

    /** Checks whether a point is within a canvas space. Used to determine
     *  whether to track a recent mouse input depending on whether the event
     *  happened within canvas or outside of canvas.
     *  @param {Vector2} pos - The position to check.
     *  @return {boolean} The result. */
    withinCanvas(pos) {
        return pos.lessThan(this.#canvasPos.addCopy(this.#canvasDimensions)) && pos.greaterThan(this.#canvasPos); 
    }

    /** Add an input to the handler's currently tracked inputs.
     *  @param {string} name - The name of the input.
     *  @param {Vector2} pos - The mouse position of the input. */
    addInput(name, pos = new Vector2(0, 0)) {
        if (!this.#acceptedNames.includes(name)) return;
        if (name !== 'MouseHold' || (name === 'MouseHold' && this.withinCanvas(pos))) 
            this.#inputs[name] = new Input(name, pos.subCopy(this.#canvasPos));
    }

    /** Remove an input from the handler's currently tracked inputs.
     *  @param {string} name - The name of the input to remove. */
    removeInput(name) {
        if (this.#acceptedNames.includes(name))
            delete this.#inputs[name];
    }
}

export default InputHandler;
