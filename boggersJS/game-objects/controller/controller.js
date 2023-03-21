import GameObject from "../game-object.js";
import ControlState from "./control-state.js";
import { InputTracker } from "../../common/index.js";

/** Controllers are a much more robust substitute to a game object's 
 *  handleInputs method. They employ a state machine where each state 
 *  determines what inputs are allowed and what animation will be played.
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
    #changeStates() {
        this.#currentStateName = this.#currentState.next;
        this.#currentState.reset();
        this.#currentState = this.#states[this.#currentStateName];
        this.#currentState.startup(this.#target);
    }

    /** Pass inputs to the control state. If the state indicates it's
     *  finished, then it will change states before passing inputs. 
     *  @param {InputTracker} inputs - The currently tracked inputs. */
    update(inputs) {
        if (this.#currentState.isDone) this.#changeStates();
        this.#currentState.update(this.#target, inputs); 
    }
}

export default Controller;
