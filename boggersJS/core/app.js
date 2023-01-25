import Vector2 from '../common/vector2.js';
import StateManager from './stateManager.js';
import InputHandler from './inputHandler.js';

export default class App {
    /** Manages the game loop. */

    /** @type {Vector2} The dimensions of the display canvas. */
    #dimensions
    /** @type {CanvasRenderingContext2D} The context of the display canvas. */
    #context
    /** @type {StateManager} The state manager of the application. */
    #stateManager
    /** @type {InputHandler} The input handler of the application. */
    #inputHandler
    /** @type {number} The last timestamp used to calculate dt. */
    #lastTime

    /** Creates the application.
     *  @param {Vector2} dimensions - The dimensions of the display canvas.
     *  @param {CanvasRenderingContext2D} context - The context of the display canvas.
     *  @param {string} start - The name of the starting state.
     *  @param {Object.<string, State>} states - The states of the application. */
    constructor(dimensions, context, start, states) { 
        this.#dimensions = dimensions;
        this.#context = context;
        this.#stateManager = new StateManager(start, states);
        this.#inputHandler = new InputHandler();
        this.#lastTime = 0;

        this.runTick = this.runTick.bind(this);
    }

    /** Runs the next frame which involves passing inputs, updating components, and drawing
     *  objects. The timestamp argument will be used with lastTime to calculate dt.
     *  @param {number} timestamp - The time passed in via requestAnimationFrame. */
    runTick(timestamp) {
        const dt = timestamp - this.#lastTime;
        this.#lastTime = timestamp;

        this.#context.clearRect(0, 0, this.#dimensions.x, this.#dimensions.y);
        this.#stateManager.passInputs(this.#inputHandler.inputs);
        this.#stateManager.update(dt);
        this.#stateManager.draw(this.#context);

        requestAnimationFrame(this.runTick);
    }
}
