import { Input } from '../common/index.js';
import { Sprite, DeltaTimeRunner, Movable, Collider, CollisionMap, Health } from '../components/index.js';

/** The primary object that all game states will deal with. This class is responsible for 
 *  handling inputs, updating its own state, and drawing itself on the screen. It also features 
 *  methods to handle object-to-object collisions and Pool operations. 
 *  @memberof GameObjects */
class GameObject {
    /** @type {Sprite} */
    #sprite
    /** @type {DeltaTimeRunner} */
    #dtRunner
    /** @type {Movable} */
    #movable
    /** @type {Collider} */
    #collider
    /** @type {CollisionMap} */
    #collisionMap
    /** @type {Health} */
    #health
    /** @type {CallableFunction} */
    #poolHook
    /** @type {boolean} */
    #canDelete

    /** Create the GameObject.
     *  @param {Sprite} sprite - The sprite representing the GameObject. */
    constructor(sprite) {
        this.#sprite = sprite;
        this.#dtRunner = new DeltaTimeRunner(20, 1000);
        this.#canDelete = false;
    }

    /** Gets the sprite.
     *  @return {Sprite} The sprite. */
    get sprite() { return this.#sprite; }

    /** Gets the DeltaTimeRunner.
     *  @return {DeltaTimeRunner} The runner. */
    get dtRunner() { return this.#dtRunner; }

    /** Gets the Movable.
     *  @return {Movable} The movable. */
    get movable() { return this.#movable; }

    /** Gets the Collider.
     *  @return {Collider} The Collider. */
    get collider() { return this.#collider; }

    /** Gets the CollisionMap.
     *  @return {CollisionMap} The map. */
    get collisionMap() { return this.#collisionMap; }

    /** Gets the Health. 
     *  @return {Health} The Health. */
    get health() { return this.#health; }

    /** Gets the pool hook, a function passed down by the parent Pool
     *  to allow elements to add/remove GameObjects in the pool. 
     *  @return {CallableFunction} The hook. */
    get poolHook() { return this.#poolHook; }

    /** Checks whether this object can be deleted.
     *  @return {boolean} The result. */
    get canDelete() { return this.#canDelete; }

    /** Sets the Movable. Used by subclasses.
     *  @param {Movable} movable - The new Movable. */
    set movable(movable) { this.#movable = movable; }

    /** Sets the Collider. Used by subclasses.
     *  @param {Collider} collider - The new Collider. */
    set collider(collider) { this.#collider = collider; }

    /** Sets the CollisionMap. Used by subclasses. 
     *  @param {CollisionMap} collisionMap - The new map. */
    set collisionMap(collisionMap) { this.#collisionMap = collisionMap; }

    /** Sets the Health. Used by subclasses. 
     *  @param {Health} health - The new Health. */
    set health(health) { this.#health = health; }

    /** Sets the poolHook. Used by the parent pool to pass down its functions. 
     *  @param {CallableFunction} hook - The hook. */
    set poolHook(hook) { this.#poolHook = hook; }

    /** Marks the object for deletion. */
    markForDeletion() { this.#canDelete = true; }

    /** Handles collisions between this GameObject and other types of GameObjects. 
     *  To be optionally implemented by subclasses.
     *  @param {GameObject} other - The other GameObject. */
    handleCollisions(other) {}

    /** Processes the inputs given by the InputHandler.
     *  To be optionally implemented by subclasses.
     *  @param {Object<string, Input>} inputs - The currently tracked inputs. */
    handleInputs(inputs) {}

    /** Update the components of the GameObject using delta time.
     *  To be optionally implemented by subclasses.
     *  @param {number} dt - The time between the last two frames. */
    update(dt) {}

    /** Draw the GameObject. Must be implemented by subclasses.
     *  @param {CanvasRenderingContext2D} context - The context to draw on. */
    draw(context) { throw new Error('Implement!'); }
}

export default GameObject;
