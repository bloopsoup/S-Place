import Vector2 from '../../common/vector2.js';

export default class Movable {
    /** A base 2D movement class that supports acceleration-based movement. 
     *  Uses maxWidth and maxHeight for bounds checking and position snapping. */

    #maxDimensions
    #dimensions
    #pos
    #velocity
    #acceleration
    #deceleration

    constructor(maxDimensions, dimensions, pos, velocity, acceleration, deceleration) {
        this.#maxDimensions = maxDimensions;
        this.#dimensions = dimensions;
        this.#pos = pos;
        this.#velocity = velocity;
        this.#acceleration = acceleration;
        this.#deceleration = deceleration;
    }

    get dimensions() { return this.#maxDimensions.copy(); }
    get pos() { return this.#pos.copy(); }
    get velocity() { return this.#velocity.copy(); }

    set pos(pos) { this.#pos = pos; }
    incrementPos() { this.#pos.add(this.#velocity); }
    snapPos() {
        if (this.pastLeftWall()) { this.#pos.x = 0; this.#velocity.x = 0; }
        if (this.pastRightWall()) { this.#pos.x = this.#maxDimensions.x - this.#dimensions.x; this.#velocity.x = 0; }
        if (this.pastFloor()) { this.#pos.y = this.#maxDimensions.y - this.#dimensions.y; this.#velocity.y = 0; }
    }
    pastLeftWall() { return this.#pos.x <= 0; }
    pastLeftWallComplete() { return this.#pos.x <= -this.#dimensions.x; }
    pastRightWall() { return this.#pos.x >= this.#maxDimensions.x - this.#dimensions.x; }
    pastRightWallComplete() { return this.#pos.x >= this.#maxDimensions.x; }
    pastCeiling() { return this.#pos.y <= 0; }
    pastCeilingComplete() { return this.#pos.y <= -this.#dimensions.y; }
    pastFloor() { return this.#pos.y >= this.#maxDimensions.y - this.#dimensions.y; }
    pastFloorComplete() { return this.#pos.y >= this.#maxDimensions.y; }
    outOfBounds() { return this.pastLeftWall() || this.pastRightWall() || this.pastCeiling() || this.pastFloor(); }
    outOfBoundsComplete() { return this.pastLeftWallComplete() || this.pastRightWallComplete() || this.pastCeilingComplete() || this.pastFloorComplete(); }

    set velocity(velocity) { this.#velocity = velocity; }
    incrementVelocity(axis, dir) {
        const modifier = new Vector2((dir === 1 || dir === 4 ? 1 : -1) * (axis === 'x' || axis === 'both' ? 1 : 0),
                                     (dir === 3 || dir === 4 ? 1 : -1) * (axis === 'y' || axis === 'both' ? 1 : 0));
        this.#velocity.add(this.#acceleration.mulCopy(modifier));
    }
    decrementVelocity(axis) {
        const modifier = new Vector2((this.#velocity.x < 0 ? 1 : -1) * ((axis === 'x' || axis === 'both') && this.#velocity.x !== 0 ? 1 : 0),
                                     (this.#velocity.y < 0 ? 1 : -1) * ((axis === 'y' || axis === 'both') && this.#velocity.y !== 0 ? 1 : 0));
        const newVelocity = this.#velocity.addCopy(this.#deceleration.mulCopy(modifier));
        newVelocity.select(new Vector2(0, 0), this.#velocity.x < 0, this.#velocity.y < 0);
        this.#velocity = newVelocity;
    }
}
