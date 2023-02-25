import Projectile from './projectile.js'
import GameObject from '../gameObject.js';
import { Grid, InputTracker, Vector2 } from '../../common/index.js';
import { Sprite, TickRunner } from '../../components/index.js';

/** An entity responsible for creating projectiles that go towards the
 *  position of a user's mouse click. Essentially a projectile factory.
 *  @author Mr.Nut and bloopsoup
 *  @augments GameObject 
 *  @memberof GameObjects.Entities */
class Gun extends GameObject {
    /** @type {Vector2} */
    #pos
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
     *  @param {number} fireDelay - The delay between spawning consecutive projectiles.
     *  @param {CallableFunction} bulletSpriteMaker - The gun's bullets' sprite constructor.
     *  @param {Grid} bulletGrid - The grid that the gun's bullets reside in.
     *  @param {number} bulletDamage - The gun's bullets' damage.
     *  @param {number} bulletSpeed - The gun's bullets' speed. */
    constructor(sprite, pos, fireDelay, bulletSpriteMaker, bulletGrid, bulletDamage, bulletSpeed) {
        super(sprite);
        this.#pos = pos;
        this.#tickRunner = new TickRunner(fireDelay, () => this.enableFire());

        this.#bulletGrid = bulletGrid;
        this.#bulletSpriteMaker = bulletSpriteMaker;
        this.#bulletDamage = bulletDamage;
        this.#bulletSpeed = bulletSpeed;
        this.#canFire = true;
    }

    /** Allow the gun to fire. */
    enableFire() { this.#canFire = true; }

    /** Add a projectile that will originate from the gun and go towards
     *  the terminal position via the pool hook.
     *  @param {Vector2} terminalPos */
    addBullet(terminalPos) {
        const bulletVelocity = terminalPos.subCopy(this.#pos);
        bulletVelocity.normalize();
        bulletVelocity.mulScalar(this.#bulletSpeed);

        const projectile = new Projectile(this.#bulletSpriteMaker(), this.#bulletGrid, this.#pos.copy(), bulletVelocity, this.#bulletDamage);
        this.poolHook('bullets', projectile);
    }

    /** Handle inputs.
     *  @see GameObject.handleInputs
     *  @param {InputTracker} inputs */
    handleInputs(inputs) {
        if (inputs.has('MouseHold') && this.#canFire) {
            this.addBullet(inputs.get('MouseHold').pos);
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
    draw(context, alpha) { this.sprite.draw(context, this.#pos); }
}

export default Gun;
