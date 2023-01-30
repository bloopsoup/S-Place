import { State } from '../common/index.js';
import StateManager from './stateManager.js';
import InputHandler from './inputHandler.js';

/** The main application which encompasses states, inputs, and the entire game loop. 
 *  All game applications running on boggersJS must start by calling the runTick method. 
 *  @memberof Core */
class App {
    /** @type {HTMLCanvasElement} */
    #canvas
    /** @type {CanvasRenderingContext2D} */
    #context
    /** @type {StateManager} */
    #stateManager
    /** @type {InputHandler} */
    #inputHandler
    /** @type {number} */
    #lastTime

    /** Creates the application.
     *  @param {HTMLCanvasElement} canvas - The display canvas.
     *  @param {string} start - The name of the starting state.
     *  @param {Object<string, State>} states - The states of the application. */
    constructor(canvas, start, states) {
        this.#canvas = canvas;
        this.#context = canvas.getContext('2d');
        this.#stateManager = new StateManager(start, states);
        this.#inputHandler = new InputHandler(canvas);
        this.#lastTime = 0;

        this.runTick = this.runTick.bind(this);
    }

    /** Runs the next frame which involves passing inputs, updating components, and drawing
     *  objects. The timestamp argument will be used with lastTime to calculate dt.
     *  @param {number} timestamp - The time passed in via requestAnimationFrame. */
    runTick(timestamp) {
        const dt = timestamp - this.#lastTime;
        this.#lastTime = timestamp;

        this.#context.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
        this.#stateManager.passInputs(this.#inputHandler.inputs);
        this.#stateManager.update(dt);
        this.#stateManager.draw(this.#context);

        requestAnimationFrame(this.runTick);
    }
}

export default App;
