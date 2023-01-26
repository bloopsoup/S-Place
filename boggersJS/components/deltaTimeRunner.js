/** Responsible for running functions periodically based on delta time. */
class DeltaTimeRunner {
    /** @type {number} */
    #time
    /** @type {number} */
    #fps
    /** @type {number} */
    #requiredSeconds

    /** Create the DeltaTimeRunner.
     *  @param {number} fps - The frames per second that the runner operates on.
     *  @param {number} requiredFrameCount - The required number of frames before it runs a function. */
    constructor(fps, requiredFrameCount) { 
        this.#time = 0
        this.#fps = fps;
        this.#requiredSeconds = requiredFrameCount / this.#fps;
    }

    /** Sets the required number of frames before the runner can execute a function. 
     *  @param {number} requiredFrameCount - The required number of frames. */
    set requiredFrameCount(requiredFrameCount) { this.#requiredSeconds = requiredFrameCount / this.#fps; }

    /** Update the timer using dt. If enough time has passed, call func and reset.
     *  @param {number} dt - The time between the last two frames.
     *  @param {CallableFunction} func - The function to call after enough time has passed. */
    deltaTimeUpdate(dt, func) {
        this.#time += dt;
        if (this.#time >= this.#requiredSeconds) {
            func();
            this.#time = 0;
        }
    }
}

export default DeltaTimeRunner;
