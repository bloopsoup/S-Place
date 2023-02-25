import { Vector2 } from '../../common/index.js';

/** A base 2D movement class that supports acceleration-based movement. 
 *  Uses maxDimensions for basic bounds checking and position snapping. 
 *  @memberof Components.Movable */
class Movable {
    /** @type {Vector2} */
    #maxDimensions
    /** @type {Vector2} */
    #dimensions
    /** @type {Vector2} */
    #oldPos
    /** @type {Vector2} */
    #pos
    /** @type {Vector2} */
    #velocity
    /** @type {Vector2} */
    #maxSpeed
    /** @type {Vector2} */
    #acceleration
    /** @type {Vector2} */
    #deceleration

    /** Create the Movable.
     *  @param {Vector2} maxDimensions - Assuming origin is (0, 0), limits how far the Movable can go down and right.
     *  @param {Vector2} dimensions - The dimensions of the Movable.
     *  @param {Vector2} pos - The starting position.
     *  @param {Vector2} velocity - The starting velocity.
     *  @param {Vector2} maxSpeed - Limits how fast a Movable can go in any direction.
     *  @param {Vector2} acceleration - The starting acceleration.
     *  @param {Vector2} deceleration - The starting deceleration. */
    constructor(maxDimensions, dimensions, pos, velocity, maxSpeed, acceleration, deceleration) {
        this.#maxDimensions = maxDimensions;
        this.#dimensions = dimensions;
        this.#oldPos = new Vector2(0, 0);
        this.#pos = pos;
        this.#velocity = velocity;
        this.#maxSpeed = maxSpeed;
        this.#acceleration = acceleration;
        this.#deceleration = deceleration;
    }

    /** Get the maximum dimensions.
     *  @return {Vector2} The maximum dimensions. */
    get maxDimensions() { return this.#maxDimensions; }

    /** Get the dimensions.
     *  @return {Vector2} The dimensions. */
    get dimensions() { return this.#dimensions; }

    /** Get the old position. This is used with the current position
     *  to calculate direction, making it useful for tile-based collisions.
     *  @return {Vector2} The old position. */
    get oldPos() { return this.#oldPos; }

    /** Get the current position.
     *  @return {Vector2} The current position. */
    get pos() { return this.#pos; }

    /** Get the velocity.
     *  @return {Vector2} The velocity. */
    get velocity() { return this.#velocity; }

    /** Get the acceleration.
     *  @return {Vector2} The acceleration. */
    get acceleration() { return this.#acceleration; }

    /** Get the deceleration.
     *  @return {Vector2} The deceleration. */
    get deceleration() { return this.#deceleration; }

    /** Get the position of the Movable's top left corner.
     *  @return {Vector2} The position of the top left corner. */
    get topLeftPos() { return this.#pos; }

    /** Get the old position of the Movable's top left corner.
     *  @return {Vector2} The old position of the top left corner. */
    get oldTopLeftPos() { return this.#oldPos; }

    /** Get the position of the Movable's top right corner.
     *  @return {Vector2} The position of the top right corner. */
    get topRightPos() { return this.#pos.addToXCopy(this.#dimensions.x); }

    /** Get the old position of the Movable's top right corner.
     *  @return {Vector2} The old position of the top right corner. */
    get oldTopRightPos() { return this.#oldPos.addToXCopy(this.#dimensions.x); }

    /** Get the position of the Movable's bottom left corner.
     *  @return {Vector2} The position of the bottom left corner. */
    get bottomLeftPos() { return this.#pos.addToYCopy(this.#dimensions.y); }

    /** Get the old position of the Movable's bottom left corner.
     *  @return {Vector2} The old position of the bottom left corner. */
    get oldBottomLeftPos() { return this.#oldPos.addToYCopy(this.#dimensions.y); }

    /** Get the position of the Movable's bottom right corner.
     *  @return {Vector2} The position of the bottom right corner. */
    get bottomRightPos() { return this.#pos.addCopy(this.#dimensions); }
    
    /** Get the old position of the Movable's bottom right corner.
     *  @return {Vector2} The old position of the bottom right corner. */
    get oldBottomRightPos() { return this.#oldPos.addCopy(this.#dimensions); }

    /** Get the positions of all corners. 
     *  @return {Array<Vector2>} The positions of all corners. */
    get corners() { return [this.topRightPos, this.topLeftPos, this.bottomLeftPos, this.bottomRightPos]; }

    /** Set the position.
     *  @param {Vector2} pos - The position. */
    set pos(pos) { this.#pos = pos; }

    /** Set the velocity. 
     *  @param {Vector2} velocity - The velocity. */
    set velocity(velocity) { this.#velocity = velocity; }

    /** Checks if the Movable is clipping past the left wall.
     *  @returns {boolean} The result. */
    pastLeftWall() { return this.#pos.x <= 0; }

    /** Checks if the Movable is completely past the left wall.
     *  @returns {boolean} The result. */
    pastLeftWallComplete() { return this.#pos.x <= -this.#dimensions.x; }

    /** Checks if the Movable is clipping past the right wall.
     *  @returns {boolean} The result. */
    pastRightWall() { return this.#pos.x >= this.#maxDimensions.x - this.#dimensions.x; }

    /** Checks if the Movable is completely past the right wall.
     *  @returns {boolean} The result. */
    pastRightWallComplete() { return this.#pos.x >= this.#maxDimensions.x; }

    /** Checks if the Movable is clipping past the ceiling.
     *  @returns {boolean} The result. */
    pastCeiling() { return this.#pos.y <= 0; }

    /** Checks if the Movable is completely past the ceiling.
     *  @returns {boolean} The result. */
    pastCeilingComplete() { return this.#pos.y <= -this.#dimensions.y; }

    /** Checks if the Movable is clipping past the floor.
     *  @returns {boolean} The result. */
    pastFloor() { return this.#pos.y >= this.#maxDimensions.y - this.#dimensions.y; }

    /** Checks if the Movable is completely past the floor.
     *  @returns {boolean} The result. */
    pastFloorComplete() { return this.#pos.y >= this.#maxDimensions.y; }

    /** Checks if the Movable is clipping out of bounds.
     *  @returns {boolean} The result. */
    outOfBounds() { return this.pastLeftWall() || this.pastRightWall() || this.pastCeiling() || this.pastFloor(); }

    /** Checks if the Movable is completely out of bounds.
     *  @returns {boolean} The result. */
    outOfBoundsComplete() { return this.pastLeftWallComplete() || this.pastRightWallComplete() || this.pastCeilingComplete() || this.pastFloorComplete(); }

    /** Update the old position and increment the current position via velocity. */
    incrementPos() {
        this.#pos.copyTo(this.#oldPos);
        this.#pos.add(this.#velocity); 
    }

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

    /** Snaps the Movable by setting its position and velocity when it attempts to go out of bounds. */
    snap() {
        if (this.pastLeftWall()) { this.#pos.x = 0; this.#velocity.x = 0; }
        if (this.pastRightWall()) { this.#pos.x = this.#maxDimensions.x - this.#dimensions.x; this.#velocity.x = 0; }
        if (this.pastCeiling()) { this.#pos.y = 0; this.#velocity.y = 0; }
        if (this.pastFloor()) { this.#pos.y = this.#maxDimensions.y - this.#dimensions.y; this.#velocity.y = 0; }
    }

    /** Snaps the Movable by settings its position and velocity to the provided arguments.
     *  @param {number} axis - The axis to snap the position and velocity to. Is in {0, 1}.
     *  @param {number} axisPos - The new axis position (either for x or y).
     *  @param {number} axisVelocity - The new axis velocity (either for x or y). */
    snapCustom(axis, axisPos, axisVelocity) {
        if (axis === 0) { this.#pos.x = axisPos; this.#velocity.x = axisVelocity; } 
        else { this.#pos.y = axisPos; this.#velocity.y = axisVelocity; }
    }
}

export default Movable;
