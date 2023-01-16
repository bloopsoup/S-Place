export default class StateManager {
    /** Runs one state at a time, switching out states when prompted. */

    #isDone
    #currentStateName
    #states
    #currentState

    constructor(start, states) {
        this.#isDone = false;
        this.#currentStateName = start, this.#states = states;
        this.#currentState = this.#states[this.#currentStateName];
        this.#currentState.startup();
    }

    get isDone() { return this.#isDone; }

    toState() {
        const previous = this.#currentStateName;
        this.#currentStateName = this.#currentState.next;
        this.#currentState.reset();

        this.#currentState = this.#states[this.#currentStateName];
        this.#currentState.previous = previous;
        this.#currentState.startup();
    }

    passInputs(inputs) { this.#currentState.handleInputs(inputs); }

    update(dt) {
        if (this.#currentState.isQuitting) this.#isDone = true;
        else if (this.#currentState.isDone) this.toState();
        this.#currentState.update(dt);
    }

    draw(context) { this.#currentState.draw(context); }
}
