import { InputTracker, State } from '../common/index.js';

/** Runs one state at a time, switching out states when prompted. 
 *  @memberof Core */
class StateManager {
    /** @type {boolean} */
    #isQuitting
    /** @type {string} */
    #currentStateName
    /** @type {Object<string, State>} */
    #states
    /** @type {State} */
    #currentState

    /** Create the StateManager.
     *  @param {string} start - The name of the starting state.
     *  @param {Object<string, State>} states - The states that the manager can transition to. */
    constructor(start, states) {
        this.#isQuitting = false;
        this.#currentStateName = start, this.#states = states;
        this.#currentState = this.#states[this.#currentStateName];
        this.#currentState.startup();
    }

    /** Check if the StateManager is quitting.
     *  @return {boolean} The result. */
    get isQuitting() { return this.#isQuitting; }

    /** Transitions from one state to another. */
    changeStates() {
        const previous = this.#currentStateName;
        this.#currentStateName = this.#currentState.next;
        this.#currentState.reset();

        this.#currentState = this.#states[this.#currentStateName];
        this.#currentState.previous = previous;
        this.#currentState.startup();
    }

    /** Pass inputs from the InputHandler into the current state.
     *  @param {InputTracker} inputs - The currently tracked inputs. */
    passInputs(inputs) { this.#currentState.handleInputs(inputs); }

    /** Update the current state's components and check if the 
     *  state wants to transition or quit. */
    update() {
        if (this.#currentState.isQuitting) this.#isQuitting = true;
        else if (this.#currentState.isDone) this.changeStates();
        this.#currentState.update();
    }

    /** Draws the current state's components.
     *  @param {CanvasRenderingContext2D} context - The context to draw on.
     *  @param {number} alpha - Used for interpolation when rendering between two states. */
    draw(context, alpha) { this.#currentState.draw(context, alpha); }
}

export default StateManager;
