import GameObject from '../gameObject.js';
import { InputTracker } from '../../common/index.js';

/** A control state. These are the modules that actually modify the controlled element.
 *  @memberof GameObjects.Controller */
class ControlState {
    /** @type {boolean} */
    #isDone
    /** @type {string} */
    #next

    /** Create the Control State. */
    constructor() { this.#isDone = false; }

    /** Check if the state is done running.
     *  @return {boolean} The result. */
    get isDone() { return this.#isDone; }

    /** Get the name of the state that the manager will transition to. 
     *  @return {string} The name of the next state. */
    get next() { return this.#next; }

    /** Called when the Controller is loading a new state. Usually
     *  this involves setting the controlled element's current animation.
     *  @param {GameObject} target - The controlled element. */
    startup(target) {}

    /** Processes the inputs given by the InputHandler. Most transitions
     *  occur here via specific user inputs like a keypress.
     *  @param {GameObject} target - The controlled element.
     *  @param {InputTracker} inputs - The currently tracked inputs. */
    handleInputs(target, inputs) {}

    /** Removes the state's done flag before the controller leaves. */
    reset() { this.#isDone = false; }

    /** Indicate to the Controller to transition to the state named dest.
     *  @param {string} dest - The name of the state to transition to. */
    goToDest(dest) {
        this.#next = dest;
        this.#isDone = true; 
    }
}

export default ControlState;
