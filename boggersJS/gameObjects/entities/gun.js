import Projectile from './projectile.js'
import GameObject from '../gameObject.js';
import { Grid, InputTracker, Vector2 } from '../../common/index.js';
import { Sprite, Movable, TickRunner } from '../../components/index.js';

/** An entity responsible for creating projectiles that go towards the
 *  position of a user's mouse click. Essentially a projectile factory.
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
    #bulletSpriteMaker
    /** @type {Grid} */
    #bulletGrid
    /** @type {number} */
    #bulletDamage
    /** @type {number} */
    #bulletSpeed
    /** @type {boolean} */
    #canFire

    /** Create the Gun.
     *  @param {Sprite} sprite - The gun's sprite.
     *  @param {Vector2} pos - The gun's position.
     *  @param {Vector2} rotatePos - The point in which the gun is rotated around. You can 
     *      treat this like an offset since its relative to the gun's own position.
     *  @param {number} fireDelay - The delay between spawning consecutive projectiles.
     *  @param {CallableFunction} bulletSpriteMaker - The gun's bullets' sprite constructor.
     *  @param {Grid} bulletGrid - The grid that the gun's bullets reside in.
     *  @param {number} bulletDamage - The gun's bullets' damage.
     *  @param {number} bulletSpeed - The gun's bullets' speed. */
    constructor(sprite, pos, rotatePos, fireDelay, bulletSpriteMaker, bulletGrid, bulletDamage, bulletSpeed) {
        super(sprite);
        this.movable = new Movable(new Vector2(0, 0), this.sprite.dimensions, pos, new Vector2(0, 0), new Vector2(0, 0), new Vector2(0, 0), new Vector2(0, 0));
        this.#rotatePos = rotatePos;
        this.#direction = new Vector2(0, 0);
        this.#tickRunner = new TickRunner(fireDelay, () => this.#enableFire());

        this.#bulletGrid = bulletGrid;
        this.#bulletSpriteMaker = bulletSpriteMaker;
        this.#bulletDamage = bulletDamage;
        this.#bulletSpeed = bulletSpeed;
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
        const bulletVelocity = this.#direction.copy();
        bulletVelocity.mulScalar(this.#bulletSpeed);
        const projectile = new Projectile(this.#bulletSpriteMaker(), this.#bulletGrid, bulletPos, bulletVelocity, this.#bulletDamage);
        this.poolHook('bullets', projectile);
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
        this.sprite.drawRotated(context, this.movable.pos, this.#rotatePos, this.#direction.toAngle())
    }
}

export default Gun;
