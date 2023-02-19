/** Responsible for running functions periodically based on delta time. 
 *  @memberof Components */
class DeltaTimeRunner {
    /** @type {number} */
    #time
    /** @type {number} */
    #fps
    /** @type {number} */
    #requiredMilliseconds

    /** Create the DeltaTimeRunner.
     *  @param {number} requiredFrameCount - The required number of frames before it runs a function.
     *  @param {number} fps - The frames per second that the runner operates on. */
    constructor(requiredFrameCount, fps = 60) { 
        this.#time = 0
        this.#fps = fps;
        this.#requiredMilliseconds = (requiredFrameCount / this.#fps) * 1000;
    }

    /** Sets the required number of frames before the runner can execute a function. 
     *  @param {number} requiredFrameCount - The required number of frames. */
    set requiredFrameCount(requiredFrameCount) { this.#requiredMilliseconds = (requiredFrameCount / this.#fps) * 1000; }

    /** Update the timer using dt. If enough time has passed, call func and reset.
     *  @param {number} dt - The milliseconds between the last two frames.
     *  @param {CallableFunction} func - The function to call after enough time has passed. */
    deltaTimeUpdate(dt, func) {
        this.#time += dt;
        if (this.#time >= this.#requiredMilliseconds) {
            func();
            this.#time = 0;
        }
    }
}

export default DeltaTimeRunner;
