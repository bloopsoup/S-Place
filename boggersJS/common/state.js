import Input from './input.js';

class State {
    /** A state abstract class that is managed by a StateManager. Actual game states 
     *  should be implemented outside of the engine. */

    /** @type {boolean} */
    #isDone
    /** @type {boolean} */
    #isQuitting
    /** @type {string} */
    #next
    /** @type {string} */
    #previous

    /** Create a new state object. */
    constructor() {
        this.#isDone = false, this.#isQuitting = false;
        this.#next = "", this.#previous = "";
    }

    /** Check if the state is done running.
     *  @return {boolean} The result. */
    get isDone() { return this.#isDone; }

    /** Check if the state wants the application to quit.
     *  @return {boolean} The result. */
    get isQuitting() { return this.#isQuitting; }

    /** Get the name of the state that the manager will transition to. 
     *  @return {string} The name of the next state. */
    get next() { return this.#next; }

    /** Get the name of the state that the manager transitioned from.
     *  @return {string} The name of the previous state. */
    get previous() { return this.#previous; }

    /** Sets the name of the previous state.
     *  @param {string} previous - The name of the previous state. */
    set previous(previous) { this.#previous = previous; }

    /** Called when the StateManager is loading a new state. Use this hook
     *  for setting up assets or initializing/loading in maps. */
    startup() { throw new Error('Implement!'); }

    /** Called when the StateManager is about to exit a state. Use this hook
     *  to reset components such as respawning enemies, restoring health, or
     *  getting rid of garbage. */
    cleanup() { throw new Error('Implement!'); }

    /** Processes the inputs given by the InputHandler.
     *  @param {Object.<string, Input>} inputs - The currently tracked inputs. */
    handleInputs(inputs) { throw new Error('Implement!'); }

    /** Updates frame-reliant components based on delta time.
     *  @param {number} dt - The time between the last two frames. */
    update(dt) { throw new Error('Implement!'); }

    /** Draws state elements and game objects onto the canvas.
     *  @param {CanvasRenderingContext2D} context - The context to draw on. */
    draw(context) { throw new Error('Implement!'); }

    /** Used by the StateManager when transitioning into a new state to reset the old state. */
    reset() { 
        this.#isDone = false; 
        this.cleanup();
    }
    
    /** Indicate to the StateManager that it should quit. */
    quit() { this.#isQuitting = true; }

    /** Indicate to the StateManager to transition to the state named dest.
     *  @param {string} dest - The name of the state to transition to. */
    goToDest(dest) {
        this.#next = dest;
        this.#isDone = true; 
    }

    /** Indicate to the StateManager to transition to the previous state. */
    goToPrevious() { this.goToDest(this.#previous); }
}

export default State;
