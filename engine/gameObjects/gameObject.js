import DeltaTimeRunner from '../components/deltaTimeRunner.js';

export default class GameObject {
    /** All game objects can handle inputs, update their own
     *  state, and draw themselves on the screen. */

    #maxDimensions
    #sprite
    #dtRunner
    #movable
    #collider
    #poolHook
    #canDelete

    constructor(maxDimensions, sprite) {
        this.#maxDimensions = maxDimensions;
        this.#sprite = sprite;

        this.#dtRunner = new DeltaTimeRunner(20, 100);
        this.#movable = null;
        this.#collider = null;

        this.#poolHook = null;
        this.#canDelete = false;
    }

    get maxDimensions() { return this.#maxDimensions.copy(); }
    get sprite() { return this.#sprite; }
    get dtRunner() { return this.#dtRunner; }
    get movable() { return this.#movable; }
    get collider() { return this.#collider; }
    get poolHook() { return this.#poolHook; }
    get canDelete() { return this.#canDelete; }

    set movable(movable) { this.#movable = movable; }
    set collider(collider) { this.#collider = collider; }
    set poolHook(hook) { this.#poolHook = hook; }
    markForDeletion() { this.#canDelete = true; }

    handleCollisions(other, buffered) {}

    handleInputs(inputs) {}

    update(dt) {}

    draw(context) { throw new Error('Implement!'); }
}
