export default class State {
    /** A state abstract class. */

    #isDone
    #isQuitting
    #next
    #previous

    constructor() {
        this.#isDone = false, this.#isQuitting = false;
        this.#next = null, this.#previous = null;
    }

    get isDone() { return this.#isDone; }
    get isQuitting() { return this.#isQuitting; }
    get next() { return this.#next; }
    get previous() { return this.#previous; }

    set previous(state) { this.#previous = state; }

    startup() { throw new Error('Implement!'); }

    cleanup() { throw new Error('Implement!'); }

    handleInputs(inputs) { throw new Error('Implement!'); }

    update(dt) { throw new Error('Implement!'); }

    draw(context) { throw new Error('Implement!'); }

    reset() { 
        this.#isDone = false; 
        this.cleanup();
    }
    
    quit() { this.#isQuitting = true; }

    goToDest(dest) {
        this.#next = dest;
        this.#isDone = true; 
    }

    goToPrevious() { this.goToDest(this.#previous); }
}
