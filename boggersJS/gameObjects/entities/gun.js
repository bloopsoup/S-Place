import Projectile from './projectile.js'
import GameObject from '../gameObject.js';
import { Input, Vector2 } from '../../common/index.js';
import { Movable, Sprite } from '../../components/index.js';

/** An entity responsible for creating projectiles that go towards the
 *  position of a user's mouse click. Essentially a projectile factory.
 *  @author Mr.Nut and bloopsoup
 *  @augments GameObject 
 *  @memberof GameObjects.Entities */
class Gun extends GameObject {
    /** @type {CallableFunction} */
    #bulletSpriteMaker
    /** @type {number} */
    #bulletDamage
    /** @type {number} */
    #bulletSpeed
    /** @type {boolean} */
    #canFire

    /** Create the Gun.
     *  @param {Vector2} maxDimensions - The bounding dimensions for the gun's bullets.
     *  @param {Sprite} sprite - The gun's sprite.
     *  @param {Vector2} pos - The gun's position.
     *  @param {number} fireDelay - The delay between spawning consecutive projectiles.
     *  @param {CallableFunction} bulletSpriteMaker - The gun's bullets' sprite constructor.
     *  @param {number} bulletDamage - The gun's bullets' damage.
     *  @param {number} bulletSpeed - The gun's bullets' speed. */
    constructor(maxDimensions, sprite, pos, fireDelay, bulletSpriteMaker, bulletDamage, bulletSpeed) {
        super(maxDimensions, sprite);
        this.movable = new Movable(maxDimensions, this.sprite.dimensions, pos, new Vector2(0, 0), new Vector2(0, 0), new Vector2(0, 0), new Vector2(0, 0));
        this.dtRunner.requiredFrameCount = fireDelay;

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
        const bulletVelocity = terminalPos.subCopy(this.movable.pos);
        bulletVelocity.normalize();
        bulletVelocity.mulScalar(this.#bulletSpeed);

        const projectile = new Projectile(this.maxDimensions, this.#bulletSpriteMaker(), this.movable.pos.copy(), bulletVelocity, this.#bulletDamage);
        this.poolHook('bullets', projectile);
    }

    /** Handle inputs.
     *  @see GameObject.handleInputs
     *  @param {Object<string, Input>} inputs */
    handleInputs(inputs) {
        if ('MouseHold' in inputs && this.#canFire) {
            this.addBullet(inputs['MouseHold'].pos);
            this.#canFire = false;
        }
    }

    /** Update components.
     *  @see GameObject.update
     *  @param {number} dt */
    update(dt) { if (!this.#canFire) this.dtRunner.deltaTimeUpdate(dt, this.enableFire);  }
}

export default Gun;
