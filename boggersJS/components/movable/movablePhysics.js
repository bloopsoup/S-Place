import Movable from './movable.js';
import { Vector2 } from '../../common/index.js';

/** Meant for characters that move and obey gravity. Has its own
 *  update function to handle velocity/acceleration over time. 
 *  @augments Movable 
 *  @memberof Components.Movable */
class MovablePhysics extends Movable {
    /** @type {number} */
    #jumpPower
    /** @type {boolean} */
    #canJump

    /** Create the MovablePhysics.
     *  @param {Vector2} maxDimensions - Assuming origin is (0, 0), limits how far the Movable can go down and right.
     *  @param {Vector2} dimensions - The dimensions of the Movable.
     *  @param {Vector2} pos - The starting position.
     *  @param {Vector2} velocity - The starting velocity.
     *  @param {Vector2} maxSpeed - Limits how fast a Movable can go in any direction.
     *  @param {Vector2} acceleration - The starting acceleration.
     *  @param {Vector2} deceleration - The starting deceleration. 
     *  @param {number} jumpPower - The y-jumping power (usually negative). */
    constructor(maxDimensions, dimensions, pos, velocity, maxSpeed, acceleration, deceleration, jumpPower) {
        super(maxDimensions, dimensions, pos, velocity, maxSpeed, acceleration, deceleration);
        this.#jumpPower = jumpPower;
        this.#canJump = true;

        this.fall = this.fall.bind(this);
    }

    /** Checks whether the Movable can jump again.
     *  @returns {boolean} The result. */
    get canJump() { return this.#canJump; }

    /** Enable jumping. */
    enableJump() { this.#canJump = true; }

    /** Jump. */
    jump() { 
        if (this.#canJump) {
            this.velocity.y = this.#jumpPower; 
            this.#canJump = false;
        }
    }

    /** Fall until you hit the floor. */
    fall() { 
        if (!this.pastFloor()) this.velocity.y += this.deceleration.y;
        else this.#canJump = true;
    }

    /** Queues a fall command. */
    queueFall() { this.commandQueue.add('fall', this.fall); }

    /** Increments/snaps the position when needed. 
     *  Also accounts for deceleration and gravity.
     *  @param {number} dt - The milliseconds between the last two frames. */
    update(dt) {
        this.snap();
        this.commandQueue.update(dt);
        this.queueIncrementPos();
        this.queueDecrementVelocity(0);
        this.queueFall();
    }
}

export default MovablePhysics;
