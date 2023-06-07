import GameObject from '../game-object.js';
import { InputTracker, Vector2 } from '../../common/index.js';
import { Sprite, Movable, TickRunner } from '../../components/index.js';

/** An entity responsible for creating projectiles that go towards the
 *  position of a user's mouse click.
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
     *  @param {number} rotateY - An offset to the gun's y value which determines the pivot.
     *  @param {number} fireDelay - The delay between spawning consecutive projectiles.
     *  @param {CallableFunction} bulletFunc - The function called to create a projectile.
     *     The signature is: FUNC(pos: Vector2, direction: Vector2) */
    constructor(sprite, pos, rotateY, fireDelay, bulletFunc) {
        super();
        this.sprite = sprite;
        this.movable = new Movable(new Vector2(0, 0), this.sprite.dimensions, pos, new Vector2(0, 0), new Vector2(0, 0), new Vector2(0, 0), new Vector2(0, 0));
        this.#rotatePos = new Vector2(0, rotateY);
        this.#direction = new Vector2(0, 0);
        this.#tickRunner = new TickRunner(fireDelay, () => this.#enableFire());
        this.#bulletFunc = bulletFunc;
        this.#canFire = true;
    }

    /** Gets the gun's orientation.
     *  @return {string} A string of either '', 'left', or 'right'. */
    get orientation() { return this.#direction.x < 0 ? 'left' : 'right'; }

    /** Gets the angle offset based on orientation. This is a workaround to how Javascript
     *  draws rotated sprites by adding PI to the drawing angle.
     *  @return {number} The angle offset. */
    get angleOffset() { return this.orientation === 'left' ? Math.PI : 0; }

    /** Allow the gun to fire. */
    #enableFire() { this.#canFire = true; }

    /** Updates the gun's currently tracked direction.
     *  @param {Vector2} terminalPos - The mouse position. */
    updateDirection(terminalPos) {
        terminalPos.copyTo(this.#direction);
        this.#direction.sub(this.movable.pos);
        this.#direction.sub(this.#rotatePos);
        this.#direction.normalize();
    }

    /** Adjusts the rotation position of the gun based on orientation and then returns it. */
    updateRotatePos() { this.#rotatePos.x = this.orientation === 'left' ? this.sprite.dimensions.x : 0; }

    /** Add a projectile that will originate from the gun and follow
     *  the currently tracked position to the Pool via the hook. */
    addBullet() {
        if (!this.#canFire) return;
        const bulletPos = this.#direction.copy();
        bulletPos.mulScalar(this.movable.dimensions.x);
        bulletPos.add(this.movable.pos);
        bulletPos.add(this.#rotatePos);
        this.poolHook('bullets', this.#bulletFunc(bulletPos, this.#direction.copy()));
        this.#canFire = false;
    }

    /** Handle inputs and update components.
     *  @see GameObject.update
     *  @param {InputTracker} inputs */
    update(inputs) {
        this.updateRotatePos();
        this.sprite.updateFrame();
        if (!this.#canFire) this.#tickRunner.update(); 
    }

    /** Draw the object.
     *  @see GameObject.draw
     *  @param {CanvasRenderingContext2D} context
     *  @param {number} alpha */
    draw(context, alpha) {
        this.sprite.drawRotated(context, this.movable.interpolatePos(alpha), this.#rotatePos, this.#direction.toAngle() + this.angleOffset);
    }
}

export default Gun;
