/** Responsible for calling a function based on the amount of ticks that have passed.
 *  @memberof Components */
class TickRunner {
    /** @type {number} */
    #currentTicks
    /** @type {number} */
    #requiredTicks
    /** @type {CallableFunction} */
    #func

    /** Create the TickRunner.
     *  @param {number} requiredTicks - The required number of ticks before it runs a function.
     *  @param {CallableFunction} func - The function to run. */
    constructor(requiredTicks, func) {
        this.#currentTicks = 0;
        this.#requiredTicks = requiredTicks;
        this.#func = func; 
    }

    /** Sets the required number of ticks before the runner can execute a function. 
     *  @param {number} requiredTicks - The required number of frames. */
    set requiredTicks(requiredTicks) { this.#requiredTicks = requiredTicks; }

    /** Update the timer by advancing it one tick. If enough time has passed, call func and reset. */
    update() {
        this.#currentTicks += 1;
        if (this.#currentTicks >= this.#requiredTicks) {
            this.#func();
            this.#currentTicks = 0;
        }
    }
}

export default TickRunner;
