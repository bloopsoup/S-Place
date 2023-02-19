import DeltaTimeRunner from './deltaTimeRunner.js';

/** Executes queued up functions based on delta time.
 *  @memberof Components */
class CommandQueue {
    /** @type {DeltaTimeRunner} */
    #dtRunner
    /** @type {Object<string, CallableFunction>} */
    #queue

    /** Create the CommandQueue. */
    constructor() {
        this.#dtRunner = new DeltaTimeRunner(1, 80);
        this.#queue = {};

        this.run = this.run.bind(this);
    }

    /** Add a command to the queue. If the command was already in the
     *  queue, nothing happens.
     *  @param {string} name - The name of the command.
     *  @param {CallableFunction} command - The function to queue. */
    add(name, command) { if (!(name in this.#queue)) this.#queue[name] = command; }

    /** Runs all commands from the queue and clears it. */
    run() {
        Object.keys(this.#queue).forEach(key => this.#queue[key]());
        this.#queue = {};
    }

    /** Processes commands after enough time has passed.
     *  @param {number} dt - The milliseconds between the last two frames. */
    update(dt) {
        if (Object.keys(this.#queue).length) this.#dtRunner.deltaTimeUpdate(dt, this.run);
    }
}

export default CommandQueue;
