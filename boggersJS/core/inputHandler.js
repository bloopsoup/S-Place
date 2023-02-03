import { InputTracker, Vector2 } from '../common/index.js';

/** Handles all keyboard and mouse inputs through event listeners. 
 *  @memberof Core */
class InputHandler {
    /** @type {HTMLCanvasElement} */
    #canvas
    /** @type {InputTracker} */
    #inputs

    /** Create the InputHandler and register event listeners for keyboard and mouse inputs. 
     *  @param {HTMLCanvasElement} canvas - The display canvas. The handler needs access
     *      to the canvas itself to properly handle resizing and converting client positions
     *      into canvas positions. */
    constructor(canvas) {
        this.#canvas = canvas;
        this.#inputs = new InputTracker();
        window.addEventListener('keydown', e => this.addInput(e.key));
        window.addEventListener('mousedown', e => this.addInput('MouseHold', new Vector2(e.clientX, e.clientY)));
        window.addEventListener('mousemove', e => this.addInput('MouseMove', new Vector2(e.clientX, e.clientY)));
        window.addEventListener('keyup', e => this.#inputs.remove(e.key));
        window.addEventListener('mouseup', _ => this.#inputs.remove('MouseHold'));
    }

    /** Get the InputHandler's currently tracked inputs.
     *  @return {InputTracker} A copy of the InputHandler's currently tracked inputs. */
    get inputs() { return this.#inputs; }

    /** Checks whether a point is within a canvas space. Used to determine whether to track 
     *  a recent mouse input depending on whether the event happened within canvas or outside 
     *  of canvas.
     *  @param {Vector2} pos - The position to check.
     *  @return {boolean} The result. */
    withinCanvas(pos) {
        const rect = this.#canvas.getBoundingClientRect();
        return pos.lessThan(new Vector2(rect.left + rect.width, rect.top + rect.height)) && pos.greaterThan(new Vector2(rect.left, rect.top)); 
    }

    /** Converts a client position into a real position (which uses the coordinate system
     *  that all gameObjects will operate in). The reason for this indirection comes from 
     *  how Javascript defines the origin when determining the position of your mouse click. 
     * 
     *  The origin is defined as the TOP LEFT, so if you want a canvas-relative position, you 
     *  need to first do clientPos - canvasPos (given directly by the client rectangle to 
     *  handle resizes).
     * 
     *  This is not enough because when you resize the canvas window, the real coordinate
     *  system resizes along with it but uses the same numbers. A 1 unit distance in the
     *  real coordinate system may have a different size than a 1 unit distance in the client
     *  coordinate system, which means you also have to scale the canvas-relative position.
     *  @param {Vector2} clientPos - The client position.
     *  @return {Vector2} The real position. */
    toRealPos(clientPos) {
        const rect = this.#canvas.getBoundingClientRect();
        const realPos = clientPos.subCopy(new Vector2(rect.left, rect.top));
        realPos.mul(new Vector2(this.#canvas.width / rect.width,  this.#canvas.height / rect.height));
        return realPos;
    }

    /** Add an input to the handler's currently tracked inputs. This function is used
     *  rather than the tracker's add method because positions and other metadata behind
     *  inputs needs to be checked. For example, you would not admit a mouse input whose
     *  position is out of bounds in relation to the canvas.
     *  @param {string} name - The name of the input.
     *  @param {Vector2} pos - The mouse position of the input. */
    addInput(name, pos = new Vector2(0, 0)) {
        switch (name) {
            case 'MouseHold':
            case 'MouseMove':
                if (!this.withinCanvas(pos)) break;
            default:
                this.#inputs.add(name, this.toRealPos(pos));
        }
    }
}

export default InputHandler;
