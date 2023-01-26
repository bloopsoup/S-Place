import State from '../common/state.js';
import Input from '../common/input.js';

/** Runs one state at a time, switching out states when prompted. */
class StateManager {
    /** @type {boolean} */
    #isQuitting
    /** @type {string} */
    #currentStateName
    /** @type {Object.<string, State>} */
    #states
    /** @type {State} */
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

export default StateManager;
