import Movable from './movable.js';

export default class MovablePhysics extends Movable {
    /** Meant for characters that move and obey gravity. Has its own
     *  update function to handle velocity/acceleration over time. */

    #jumpPower

    constructor(maxDimensions, dimensions, pos, velocity, acceleration, deceleration, jumpPower) {
        super(maxDimensions, dimensions, pos, velocity, acceleration, deceleration);
        this.#jumpPower = jumpPower;
    }

    jump() { if (this.pastFloor()) this.velocity.y = this.#jumpPower; }
    fall() { if (!this.pastFloor()) this.velocity.y += this.deceleration.y; }

    updatePhysics() {
        this.incrementPos();
        this.snapPos();
        this.decrementVelocity('x');
        this.fall();
    }
}
