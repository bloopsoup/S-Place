import Movable from './movable.js';
import Vector2 from '../../common/vector2.js';

class MovablePhysics extends Movable {
    /** Meant for characters that move and obey gravity. Has its own
     *  update function to handle velocity/acceleration over time. */

    /** @type {number} */
    #jumpPower

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
    }

    /** */
    jump() { if (this.pastFloor()) this.velocity.y = this.#jumpPower; }

    /** */
    fall() { if (!this.pastFloor()) this.velocity.y += this.deceleration.y; }

    /** */
    update() {
        this.incrementPos();
        this.snap();
        this.decrementVelocity('x');
        this.fall();
    }
}

export default MovablePhysics;
