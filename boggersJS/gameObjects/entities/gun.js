import GameObject from '../gameObject.js';
import { InputTracker, Vector2 } from '../../common/index.js';
import { Sprite, Movable, TickRunner } from '../../components/index.js';

/** An entity responsible for creating projectiles that go towards the
 *  position of a user's mouse click.
 *  @author Mr.Nut and bloopsoup
 *  @augments GameObject 
 *  @memberof GameObjects.Entities */
class Gun extends GameObject {
    /** @type {Vector2} */
    #rotatePos
    /** @type {Vector2} */
    #direction
    /** @type {TickRunner} */
    #tickRunner
    /** @type {CallableFunction} */
    #bulletFunc
    /** @type {boolean} */
    #canFire

    /** Create the Gun.
     *  @param {Sprite} sprite - The gun's sprite.
     *  @param {Vector2} pos - The gun's position.
     *  @param {Vector2} rotatePos - The point in which the gun is rotated around. You can 
     *      treat this like an offset since its relative to the gun's own position.
     *  @param {number} fireDelay - The delay between spawning consecutive projectiles.
     *  @param {CallableFunction} bulletFunc - The function called to create a projectile.
     *     The signature is: FUNC(pos: Vector2, direction: Vector2) */
    constructor(sprite, pos, rotatePos, fireDelay, bulletFunc) {
        super(sprite);
        this.movable = new Movable(new Vector2(0, 0), this.sprite.dimensions, pos, new Vector2(0, 0), new Vector2(0, 0), new Vector2(0, 0), new Vector2(0, 0));
        this.#rotatePos = rotatePos;
        this.#direction = new Vector2(0, 0);
        this.#tickRunner = new TickRunner(fireDelay, () => this.#enableFire());
        this.#bulletFunc = bulletFunc;
        this.#canFire = true;
    }

    /** Allow the gun to fire. */
    #enableFire() { this.#canFire = true; }

    /** Updates the gun's currently tracked direction.
     *  @param {Vector2} terminalPos - The mouse position. */
    #updateDirection(terminalPos) {
        terminalPos.copyTo(this.#direction);
        this.#direction.sub(this.movable.pos);
        this.#direction.sub(this.#rotatePos);
        this.#direction.normalize();
    }

    /** Add a projectile that will originate from the gun and follow
     *  the currently tracked position to the Pool via the hook. */
    #addBullet() {
        const bulletPos = this.#direction.copy();
        bulletPos.mulScalar(this.movable.dimensions.x);
        bulletPos.add(this.movable.pos);
        bulletPos.add(this.#rotatePos);
        this.poolHook('bullets', this.#bulletFunc(bulletPos, this.#direction.copy()));
    }

    /** Handle inputs.
     *  @see GameObject.handleInputs
     *  @param {InputTracker} inputs */
    handleInputs(inputs) {
        if (!inputs.has('MouseMove')) return;
        this.#updateDirection(inputs.get('MouseMove').pos);
        if (inputs.has('MouseHold') && this.#canFire) {
            this.#addBullet();
            this.#canFire = false;
        }
    }

    /** Update components.
     *  @see GameObject.update */
    update() { if (!this.#canFire) this.#tickRunner.update(); }

    /** Draw the object.
     *  @see GameObject.draw
     *  @param {CanvasRenderingContext2D} context
     *  @param {number} alpha */
    draw(context, alpha) {
        this.sprite.drawRotated(context, this.movable.interpolatePos(alpha), this.#rotatePos, this.#direction.toAngle())
    }
}

export default Gun;
