import State from '../common/state.js';

export default class StateManager {
    /** Runs one state at a time, switching out states when prompted. */

    /** @type {boolean} Indicates whether the manager should terminate the application. */
    #isQuitting
    /** @type {string} The name of the current state that is running. */
    #currentStateName
    /** @type {Object.<string, State>} The states that the manager can transition to. */
    #states
    /** @type {State} The current state that is running. */
    #currentState

    /** Create the StateManager.
     *  @param {string} start - The name of the starting state.
     *  @param {Object.<string, State>} states - The states that the manager can transition to. */
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
     *  @param {Object.<string, Input>} inputs - The currently tracked inputs. */
    passInputs(inputs) { this.#currentState.handleInputs(inputs); }

    /** Update the current state's components and check if the 
     *  state wants to transition or quit.
     *  @param {number} dt -  The time between the last two frames. */
    update(dt) {
        if (this.#currentState.isQuitting) this.#isQuitting = true;
        else if (this.#currentState.isDone) this.changeStates();
        this.#currentState.update(dt);
    }

    /** Draws the current state's components.
     *  @param {CanvasRenderingContext2D} context - The context to draw on. */
    draw(context) { this.#currentState.draw(context); }
}
