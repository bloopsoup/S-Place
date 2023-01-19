export default class DeltaTimeRunner {
    /** Responsible for running functions periodically based on delta time. */

    #time
    #fps
    #requiredSeconds

    constructor(fps, requiredFrameCount) { 
        this.#time = 0
        this.#fps = fps;
        this.#requiredSeconds = requiredFrameCount / this.#fps;
    }

    set requiredFrameCount(requiredFrameCount) { this.#requiredSeconds = requiredFrameCount / this.#fps; }

    deltaTimeUpdate(dt, func) {
        this.#time += dt;
        if (this.#time >= this.#requiredSeconds) {
            func();
            this.time = 0;
        }
    }
}
