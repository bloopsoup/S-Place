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
        this.#target = target;
        this.#maxSpeed = maxSpeed;
        this.#acceleration = acceleration;
        this.#deceleration = deceleration;
        this.#lift = lift;
        this.#gravity = gravity;
    }

    /** Update the y-velocity such that it is jumping. */
    jump() { this.#target.velocity.sub(new Vector2(0, this.#lift)); }

    /** Updates the y-velocity such that it will be falling. */
    fall() { this.#target.velocity.add(new Vector2(0, this.#gravity)); }

    /** Increment the velocity based on the provided direction. For example,
     *  if the direction is (1, 0), only the velocity's x will increase positively.
     *  @param {Vector2} dir - A Vector2 whose elements are in {-1, 0, 1}. */
    incrementVelocity(dir) { 
        const delta = this.#acceleration.copy().mul(dir);
        this.#target.velocity.add(delta);
        const clamp = this.#maxSpeed.copy().mul(dir).selectIfZero(this.#target.velocity);
        this.#target.velocity.select(clamp, dir.x > 0, dir.y > 0);
    }

    /** Decrement the velocity so that the chosen axis velocity goes to 0.
     *  @param {number} axis - The velocity axis to zero out. Is in {0, 1, 2}. */
    decrementVelocity(axis) {
        const delta = new Vector2(-Math.sign(this.#target.velocity.x) * ((axis === 0 || axis === 2) ? 1 : 0),
                                  -Math.sign(this.#target.velocity.y) * ((axis === 1 || axis === 2) ? 1 : 0));
        delta.mul(this.#deceleration).add(this.#target.velocity).selectWithZero(this.#target.velocity.x < 0, this.#target.velocity.y < 0);
        delta.copyTo(this.#target.velocity);
    }
}

export default Mover;
