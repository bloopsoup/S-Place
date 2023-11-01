import Rectangle from './rectangle.js';
import { Vector2 } from '../../common/index.js';

/** A movement class that supports acceleration-based movement.
 *  Operates on a rectangle object.
 *  @memberof Components.Physics */
class Mover {
    /** @type {Rectangle} */
    #target
    /** @type {Vector2} */
    #velocity
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
     *  @param {Vector2} velocity - The starting velocity. 
     *  @param {Vector2} maxSpeed - Limits how fast the mover can be in any direction.
     *  @param {Vector2} acceleration - The starting acceleration.
     *  @param {Vector2} deceleration - The starting deceleration. 
     *  @param {number} lift - The lift rate.
     *  @param {number} gravity - The gravity rate. */
    constructor(target, velocity, maxSpeed = new Vector2(0, 0), acceleration = new Vector2(0, 0), deceleration = new Vector2(0, 0), lift = 0, gravity = 0) {
        this.#target = target;
        this.#velocity = velocity;
        this.#maxSpeed = maxSpeed;
        this.#acceleration = acceleration;
        this.#deceleration = deceleration;
        this.#lift = lift;
        this.#gravity = gravity;
    }

    /** Moves the target rectangle using its current velocity. */
    moveTarget() { this.#target.incrementPos(this.#velocity); }

    /** Update the y-velocity such that it is jumping. */
    jump() { this.#velocity.y -= this.#lift; }

    /** Updates the y-velocity such that it will be falling. */
    fall() { this.#velocity.y += this.#gravity; }

    /** Increment the velocity based on the provided direction. For example,
     *  if the direction is (1, 0), only the velocity's x will increase positively.
     *  @param {Vector2} dir - A Vector2 whose elements are in {-1, 0, 1}. */
    incrementVelocity(dir) { 
        const buffer = this.#acceleration.copy();
        buffer.mul(dir);
        this.#velocity.add(buffer);
        this.#maxSpeed.copyTo(buffer);
        buffer.mul(dir);
        buffer.selectIfZero(this.#velocity);
        this.#velocity.select(buffer, dir.x > 0, dir.y > 0);
    }

    /** Decrement the velocity so that the chosen axis velocity goes to 0.
     *  @param {number} axis - The velocity axis to zero out. Is in {0, 1, 2}. */
    decrementVelocity(axis) {
        const buffer = new Vector2(-Math.sign(this.#velocity.x) * ((axis === 0 || axis === 2) ? 1 : 0),
                                   -Math.sign(this.#velocity.y) * ((axis === 1 || axis === 2) ? 1 : 0));
        buffer.mul(this.#deceleration);
        buffer.add(this.#velocity);
        buffer.selectWithZero(this.#velocity.x < 0, this.#velocity.y < 0);
        buffer.copyTo(this.#velocity);
    }
}

export default Mover;
