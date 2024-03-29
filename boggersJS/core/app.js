import StateManager from './state-manager.js';
import InputHandler from './input-handler.js';

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
    #dt
    /** @type {number} */
    #maxDt
    /** @type {number} */
    #accumulator
    /** @type {number} */
    #lastTime

    /** Creates the application.
     *  @param {HTMLCanvasElement} canvas - The display canvas.
     *  @param {StateManager} stateManager - The state manager.
     *  @param {InputHandler} inputHandler - The input handler.
     *  @param {number} gameFps - How often the game logic should update. */
    constructor(canvas, stateManager, inputHandler, gameFps = 120) {
        this.#canvas = canvas;
        this.#context = canvas.getContext('2d');
        this.#stateManager = stateManager;
        this.#inputHandler = inputHandler;

        this.#dt = 1 / gameFps;
        this.#maxDt = 10 * this.#dt;
        this.#accumulator = 0;
        this.#lastTime = 0;

        this.runTick = this.runTick.bind(this);
    }

    /** Runs the next frame which involves passing inputs, updating components, and drawing
     *  objects. The timestamp argument will be used with lastTime to calculate dt. 
     * 
     *  Note that input passing and component updates occur at a FIXED timestep while 
     *  drawing is (usually) synced to your monitor's refresh rate.
     * 
     *  This code is based on the tutorial
     *  {@link https://www.gafferongames.com/post/fix_your_timestep/ Fix Your Timestep!}.
     *  @param {number} timestamp - The time passed in via requestAnimationFrame. */
    runTick(timestamp) {
        let currentDt = (timestamp - this.#lastTime) / 1000;
        currentDt = Math.min(currentDt, this.#maxDt);
        this.#lastTime = timestamp;

        this.#accumulator += currentDt;
        while (this.#accumulator >= this.#dt) {
            this.#stateManager.update(this.#inputHandler.inputs);
            this.#accumulator -= this.#dt;
        }

        const alpha = this.#accumulator / this.#dt;
        this.#context.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
        this.#stateManager.draw(this.#context, alpha);
        requestAnimationFrame(this.runTick);
    }
}

export default App;
