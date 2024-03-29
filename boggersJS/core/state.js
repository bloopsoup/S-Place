import Settings from './settings.js';
import Loader from './loader.js';
import { InputTracker } from '../common/index.js';

/** A state abstract class that is managed by a StateManager. Actual game states 
 *  should be implemented outside of the engine.
 *  
 *  The state machine architecture seen here is based on this tutorial
 *  {@link https://python-forum.io/thread-336.html Creating a state machine}
 *  @memberof Core */
class State {
    /** @type {Settings} */
    #settings
    /** @type {Loader} */
    #loader
    /** @type {boolean} */
    #isDone
    /** @type {boolean} */
    #isQuitting
    /** @type {string} */
    #next
    /** @type {string} */
    #previous

    /** Create a new state object. 
     *  @param {Settings} settings - The settings shared by all states.
     *  @param {Loader} loader - The asset loader used by all states to load images, sounds, etc. */
    constructor(settings, loader) {
        this.#settings = settings;
        this.#loader = loader;
        this.#isDone = false, this.#isQuitting = false;
        this.#next = "", this.#previous = "";
    }

    /** Gets the global state settings.
     *  @returns {Settings} The settings. */
    get settings() { return this.#settings; }

    /** Gets the asset loader.
     *  @returns {Loader} The loader. */
    get loader() { return this.#loader; }

    /** Check if the state is done running.
     *  @returns {boolean} The result. */
    get isDone() { return this.#isDone; }

    /** Check if the state wants the application to quit.
     *  @returns {boolean} The result. */
    get isQuitting() { return this.#isQuitting; }

    /** Get the name of the state that the manager will transition to. 
     *  @returns {string} The name of the next state. */
    get next() { return this.#next; }

    /** Get the name of the state that the manager transitioned from.
     *  @returns {string} The name of the previous state. */
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

    /** Processes the inputs given by the InputHandler and updates components. 
     *  @param {InputTracker} inputs - The currently tracked inputs. */
    update(inputs) { throw new Error('Implement!'); }

    /** Draws state elements and game objects onto the canvas.
     *  @param {CanvasRenderingContext2D} context - The context to draw on.
     *  @param {number} alpha - Used for interpolation when rendering between two states. */
    draw(context, alpha) { throw new Error('Implement!'); }

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
