import { Gun } from './gun/index.js';
import { Player } from './player/index.js';
import GameObject from '../game-object.js';
import { InputTracker, Vector2 } from '../../common/index.js';

/** A combination of a player and a gun.
 *  @augments GameObject
 *  @memberof GameObjects.Entities */
class Shooter extends GameObject {
    /** @type {Player} */
    #player
    /** @type {Gun} */
    #gun
    /** @type {Vector2} */
    #gunOffset
    /** @type {Vector2} */
    #adjustedGunPos

    /** Create the Shooter.
     *  @param {Player} player - The player.
     *  @param {Gun} gun - The gun.
     *  @param {Vector2} offset - The offset to the player's position which
     *      determines the gun location. */
    constructor(player, gun, offset) {
        super();
        this.#player = player;
        this.#gun = gun;
        this.#gunOffset = offset;
        this.#adjustedGunPos = new Vector2(0, 0);
    }

    /** Adjusts the drawing position of the gun based on its orientation and returns it.
     *  @return {Vector2} The adjusted position. */
    get adjustedGunPos() {
        this.#player.movable.pos.copyTo(this.#adjustedGunPos);
        if (this.#gun.orientation === 'left') this.#adjustedGunPos.addToBoth(this.#player.movable.dimensions.x - this.#gunOffset.x - this.#gun.movable.dimensions.x, this.#gunOffset.y);
        else this.#adjustedGunPos.add(this.#gunOffset);
        return this.#adjustedGunPos;
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

    /** Handle inputs and update components.
     *  @see GameObject.update
     *  @param {InputTracker} inputs */
    update(inputs) {
        this.#player.update(inputs);
        this.#gun.movable.replacePos(this.adjustedGunPos);
        this.#gun.update(inputs);
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
