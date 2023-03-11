import Gun from './gun.js';
import Player from './player.js';
import GameObject from '../gameObject.js';
import { InputTracker } from '../../common/index.js';

/** A combination of a player and a gun.
 *  @augments GameObject
 *  @memberof GameObjects.Entities */
class Shooter extends GameObject {
    /** @type {Player} */
    #player
    /** @type {Gun} */
    #gun

    /** Create the Shooter.
     *  @param {Player} player - The player.
     *  @param {Gun} gun - The gun. */
    constructor(player, gun) {
        super();
        this.#player = player;
        this.#gun = gun;
    }

    /** Sets the poolHook.
     *  @param {CallableFunction} hook */
    set poolHook(hook) { 
        this.#player.poolHook = hook;
        this.#gun.poolHook = hook;
    }

    /** Handle collisions.
     *  @see GameObject.handleCollisions
     *  @param {GameObject} other */
    handleCollisions(other) {
        this.#player.handleCollisions(other);
    }

    /** Handle inputs.
     *  @see GameObject.handleInputs
     *  @param {InputTracker} inputs */
    handleInputs(inputs) {
        this.#gun.handleInputs(inputs);
    }

    /** Update components.
     *  @see GameObject.update */
    update() {
        this.#player.update();
        this.#gun.movable.replacePos(this.#player.movable.pos);
        this.#gun.update();
    }

    /** Draw the object.
     *  @see GameObject.draw
     *  @param {CanvasRenderingContext2D} context
     *  @param {number} alpha */
    draw(context, alpha) { 
        this.#player.draw(context, alpha);
        this.#gun.draw(context, alpha);
    }
}

export default Shooter;
