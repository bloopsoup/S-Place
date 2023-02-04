import GameObject from "../gameObject.js";
import ControlState from "./controlState.js";
import { InputTracker } from "../../common/index.js";

/** Controllers are a much more robust substitute to a game object's 
 *  handleInputs method. They employ a state machine where each state 
 *  determines what inputs are allowed and what animation will be played.
 * 
 *  You should use controllers rather than implementing a game object's
 *  handleInputs if you expect to that the object itself will have many
 *  states based on input such as running, walking, idle, etc. 
 *  @memberof GameObjects.Controller */
class Controller {
    /** @type {GameObject} */
    #target
    /** @type {string} */
    #currentStateName
    /** @type {Object<string, ControlState>} */
    #states
    /** @type {ControlState} */
    #currentState

    /** Create the Controller.
     *  @param {string} start - The name of the starting state.
     *  @param {Object<string, ControlState>} states - The states that the manager can transition to. 
     *  @param {GameObject} target - The element being controlled. */
    constructor(start, states, target) {
        this.#target = target;
        this.#currentStateName = start, this.#states = states;
        this.#currentState = this.#states[this.#currentStateName];
        this.#currentState.startup(this.#target);
    }

    /** Transition to the next control state. */
    changeStates() {
        this.#currentStateName = this.#currentState.next;
        this.#currentState.reset();
        this.#currentState = this.#states[this.#currentStateName];
        this.#currentState.startup(this.#target);
    }

    /** Pass inputs to the control state. If the state indicates it's
     *  finished, then it will change states before passing inputs. 
     *  @param {InputTracker} inputs - The currently tracked inputs. */
    passInputs(inputs) {
        if (this.#currentState.isDone) this.changeStates();
        this.#currentState.handleInputs(this.#target, inputs); 
    }
}

export default Controller;
