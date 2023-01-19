import StateManager from './stateManager.js';
import InputHandler from './inputHandler.js';

export default class App {
    /** Manages the game loop. */

    #dimensions
    #context
    #lastTime
    #stateManager
    #inputHandler

    constructor(dimensions, context, start, states) { 
        this.#dimensions = dimensions;
        this.#context = context;
        this.#lastTime = 0;
        this.#stateManager = new StateManager(start, states);
        this.#inputHandler = new InputHandler();

        this.runTick = this.runTick.bind(this);
    }

    runTick(timeStamp) {
        const dt = timeStamp - this.#lastTime;
        this.#lastTime = timeStamp;

        this.#context.clearRect(0, 0, this.#dimensions.x, this.#dimensions.y);
        this.#stateManager.passInputs(this.#inputHandler.inputs);
        this.#stateManager.update(dt);
        this.#stateManager.draw(this.#context);

        requestAnimationFrame(this.runTick);
    }
}
