import State from './state.js';
import { InputTracker } from '../common/index.js';

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
    #changeStates() {
        const previous = this.#currentStateName;
        this.#currentStateName = this.#currentState.next;
        this.#currentState.reset();

        this.#currentState = this.#states[this.#currentStateName];
        this.#currentState.previous = previous;
        this.#currentState.startup();
    }

    /** Pass inputs from the InputHandler and update the current state's components.
     *  The manager also checks if the state wants to transition or quit.
     *  @param {InputTracker} inputs - The currently tracked inputs. */
    update(inputs) {
        if (this.#currentState.isQuitting) this.#isQuitting = true;
        else if (this.#currentState.isDone) this.#changeStates();
        this.#currentState.update(inputs);
    }

    /** Draws the current state's components.
     *  @param {CanvasRenderingContext2D} context - The context to draw on.
     *  @param {number} alpha - Used for interpolation when rendering between two states. */
    draw(context, alpha) { this.#currentState.draw(context, alpha); }
}

export default StateManager;
