import State from './state.js';
import Settings from './settings.js';
import Loader from './loader.js';
import { InputTracker } from '../common/index.js';

/** Runs one state at a time, switching out states when prompted.
 *  
 *  The state machine architecture seen here is based on this tutorial
 *  {@link https://python-forum.io/thread-336.html Creating a state machine}
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
     *  @param {Object<string, function(new:State, Settings, Loader)>} stateConstructors - The state constructors.
     *  @param {Settings} settings - The global state settings. 
     *  @param {Loader} loader - The asset loader. */
    constructor(start, stateConstructors, settings, loader) {
        this.#states = {};
        for (const stateName in stateConstructors) this.#states[stateName] = new stateConstructors[stateName](settings, loader);

        this.#isQuitting = false;
        this.#currentStateName = start;
        this.#currentState = this.#states[this.#currentStateName];
        this.#currentState.startup();
    }

    /** Check if the StateManager is quitting.
     *  @returns {boolean} The result. */
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
