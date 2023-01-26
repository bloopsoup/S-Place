import Vector2 from '../../common/vector2.js';

class Movable {
    /** A base 2D movement class that supports acceleration-based movement. 
     *  Uses maxDimensions for basic bounds checking and position snapping. */

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
    get maxDimensions() { return this.#maxDimensions.copy(); }

    /** Get the dimensions.
     *  @return {Vector2} The dimensions. */
    get dimensions() { return this.#dimensions.copy(); }

    /** Get the old position. This is used with the current position
     *  to calculate direction, making it useful for tile-based collisions.
     *  @return {Vector2} The old position. */
    get oldPos() { return this.#oldPos.copy(); }

    /** Get the current position.
     *  @return {Vector2} The current position. */
    get pos() { return this.#pos; }

    /** Get the velocity.
     *  @return {Vector2} The velocity. */
    get velocity() { return this.#velocity; }

    /** Get the acceleration.
     *  @return {Vector2} The acceleration. */
    get acceleration() { return this.#acceleration.copy(); }

    /** Get the deceleration.
     *  @return {Vector2} The deceleration. */
    get deceleration() { return this.#deceleration.copy(); }

    /** Get the position of the Movable's top left corner.
     *  @return {Vector2} The position of the top left corner. */
    get topLeftPos() { return this.#pos.copy(); }

    /** Get the old position of the Movable's top left corner.
     *  @return {Vector2} The old position of the top left corner. */
    get oldTopLeftPos() { return this.#oldPos.copy(); }

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

    /** Set the position.
     *  @param {Vector2} pos - The position. */
    set pos(pos) { this.#pos = pos; }

    /** Update the old position and increment the current position via velocity. */
    incrementPos() { 
        this.#oldPos = this.#pos.copy();
        this.#pos.add(this.#velocity); 
    }

    /** Set the velocity. 
     *  @param {Vector2} velocity - The velocity. */
    set velocity(velocity) { this.#velocity = velocity; }

    /** Increment the velocity based on the provided direction. For example,
     *  if the direction is (1, 0), only the velocity's x will increase positively.
     *  @param {Vector2} dir - A Vector2 whose elements are in {-1, 0, 1}. */
    incrementVelocity(dir) { 
        this.#velocity.add(this.#acceleration.mulCopy(dir));
        const maxVelocity = this.#maxSpeed.mulCopy(dir);
        maxVelocity.selectIfZero(this.#velocity);
        this.#velocity.select(maxVelocity, dir.x > 0, dir.y > 0);
    }

    /** Decrement the velocity so that the chosen axis velocity goes to 0.
     *  @param {string} axis - The velocity axis to zero out. Is in {'x', 'y', 'both'}. */
    decrementVelocity(axis) {
        const modifier = new Vector2(-Math.sign(this.#velocity.x) * ((axis === 'x' || axis === 'both') ? 1 : 0),
                                     -Math.sign(this.#velocity.y) * ((axis === 'y' || axis === 'both') ? 1 : 0));
        const newVelocity = this.#velocity.addCopy(this.#deceleration.mulCopy(modifier));
        newVelocity.select(new Vector2(0, 0), this.#velocity.x < 0, this.#velocity.y < 0);
        this.#velocity = newVelocity;
    }

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

    /** Snaps the Movable by setting its position and velocity when it attempts to go out of bounds. */
    snap() {
        if (this.pastLeftWall()) { this.#pos.x = 0; this.#velocity.x = 0; }
        if (this.pastRightWall()) { this.#pos.x = this.#maxDimensions.x - this.#dimensions.x; this.#velocity.x = 0; }
        if (this.pastFloor()) { this.#pos.y = this.#maxDimensions.y - this.#dimensions.y; this.#velocity.y = 0; }
    }
}

export default Movable;
