import Rectangle from './rectangle.js';
import { Vector2 } from '../../common/index.js';

/** A movement class that supports acceleration-based movement.
 *  Operates on a rectangle object.
 *  @memberof Components.Physics */
class Mover {
    /** @type {Rectangle} */
    #target
    /** @type {Vector2} */
    #maxSpeed
    /** @type {Vector2} */
    #acceleration
    /** @type {Vector2} */
    #deceleration
    /** @type {number} */
    #lift
    /** @type {number} */
    #gravity

    /** Create the Mover.
     *  @param {Rectangle} target - The target rectangle.
     *  @param {Vector2} maxSpeed - Limits how fast the mover can be in any direction.
     *  @param {Vector2} acceleration - The starting acceleration.
     *  @param {Vector2} deceleration - The starting deceleration. 
     *  @param {number} lift - The lift rate.
     *  @param {number} gravity - The gravity rate. */
    constructor(target, maxSpeed = new Vector2(0, 0), acceleration = new Vector2(0, 0), deceleration = new Vector2(0, 0), lift = 0, gravity = 0) {
        if (maxSpeed.isPartNegative()) throw new Error('max speed should be non-negative');
        if (acceleration.isPartNegative()) throw new Error('acceleration should be non-negative');
        if (deceleration.isPartNegative()) throw new Error('deceleration should be non-negative');
        if (lift < 0) throw new Error('lift should be non-negative');
        if (gravity < 0) throw new Error('gravity should be non-negative');

        this.#target = target;
        this.#maxSpeed = maxSpeed;
        this.#acceleration = acceleration;
        this.#deceleration = deceleration;
        this.#lift = lift;
        this.#gravity = gravity;
    }

    /** Update the y-velocity such that it is jumping. */
    jump() { this.#target.velocity = this.#target.velocity.addToY(-this.#lift); }

    /** Updates the y-velocity such that it will be falling. */
    fall() { this.#target.velocity = this.#target.velocity.addToY(this.#gravity); }

    /** Increment the velocity based on the provided direction. For example,
     *  if the direction is (1, 0), only the velocity's x will increase positively.
     *  @param {Vector2} dir - A Vector2 whose elements are in {-1, 0, 1}. */
    incrementVelocity(dir) { 
        const velocity = this.#target.velocity;
        const delta = this.#acceleration.mulCopy(dir);
        velocity.add(delta);
        const clamp = this.#maxSpeed.mulCopy(dir).selectIfZero(velocity);
        velocity.select(clamp, dir.x > 0, dir.y > 0);
        this.#target.velocity = velocity;
    }

    /** Decrement the velocity so that the chosen axis velocity goes to 0.
     *  @param {number} axis - The velocity axis to zero out. Is in {0, 1, 2}. */
    decrementVelocity(axis) {
        const velocity = this.#target.velocity;
        const delta = new Vector2(-Math.sign(velocity.x) * ((axis === 0 || axis === 2) ? 1 : 0),
                                  -Math.sign(velocity.y) * ((axis === 1 || axis === 2) ? 1 : 0));
        delta.mul(this.#deceleration).add(velocity).selectWithZero(velocity.x < 0, velocity.y < 0);
        this.#target.velocity = delta;
    }
}

export default Mover;
