/** Executes queued up functions every tick.
 *  @memberof Components */
class CommandQueue {
    /** @type {Object<string, CallableFunction>} */
    #queue

    /** Create the CommandQueue. */
    constructor() { this.#queue = {}; }

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

    /** Processes commands after every tick. */
    update() { if (Object.keys(this.#queue).length) this.run(); }
}
