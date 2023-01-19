import Movable from './movable.js';
import Vector2 from '../../common/vector2.js';

export default class MovableBG extends Movable {
    /** Meant for moving backgrounds. Provides methods for determining starting positions
     *  and "next" positions such that backgrounds can be spliced together. */

    #startPos

    constructor(maxDimensions, dimensions, velocity) {
        super(maxDimensions, dimensions, new Vector2(0, 0), velocity, new Vector2(0, 0), new Vector2(0, 0));
        this.#startPos = new Vector2(this.velocity.x <= 0 ? 0 : this.maxDimensions.x - this.dimensions.x,
                                     this.velocity.y <= 0 ? 0 : this.maxDimensions.y - this.dimensions.y);
        this.resetPos();
    }

    get nextPos() {
        const nextPos = new Vector2((this.velocity.x >= 0 ? -1 : 1) * (this.velocity.x === 0 ? 0 : 1), 
                                    (this.velocity.y >= 0 ? -1 : 1) * (this.velocity.y === 0 ? 0 : 1));
        nextPos.mul(this.dimensions);
        nextPos.add(this.pos);
        nextPos.add(this.velocity);
        return nextPos;
    }

    resetPos() { this.pos = this.#startPos.copy(); }

    update() {
        this.incrementPos();
        if (this.outOfBoundsComplete()) this.resetPos();   
    }
}
