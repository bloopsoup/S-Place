import GameObject from '../gameObject.js';
import { Grid, InputTracker, Vector2 } from '../../common/index.js';
import { Sprite, MovablePhysics, Collider, CollisionMap, Health } from '../../components/index.js';

/** The player character directly controlled via user input. Has physics-based
 *  movement behavior which supports tile-based collision. Also has a health
 *  component similar to Enemy.
 *  @augments GameObject
 *  @memberof GameObjects.Entities */
class Player extends GameObject {
    /** Create the Player.
     *  @param {Sprite} sprite - The player's sprite.
     *  @param {Grid} grid - The grid the player operates in.
     *  @param {Vector2} pos - The player's starting position.
     *  @param {Vector2} maxSpeed - The player's max speed.
     *  @param {Vector2} acceleration - The acceleration of the player.
     *  @param {Vector2} deceleration - The deceleration of the player. 
     *  @param {number} jumpPower - How high the player can jump.
     *  @param {number} health - The starting health. */
    constructor(sprite, grid, pos, maxSpeed, acceleration, deceleration, jumpPower, health) {
        super(sprite);
        this.movable = new MovablePhysics(grid.dimensions, this.sprite.dimensions, pos, new Vector2(0, 0), maxSpeed, acceleration, deceleration, jumpPower);
        this.collider = new Collider(100);
        this.collisionMap = new CollisionMap(grid);
        this.health = new Health(health);
    }

    /** Handle collisions.
     *  @see GameObject.handleCollisions
     *  @param {GameObject} other */
    handleCollisions(other) {
        if (this.collider.collides(this.movable, other.movable, true)) console.log('PLAYER GOES OUCH');
    }

    /** Handle tile collisions.
     *  @see GameObject.handleTileCollisions */
    handleTileCollisions() {
        const corners = this.movable.corners;
        for (let i in corners) {
            const correction = this.collisionMap.callCollisionHandler(this.movable, corners[i]);
            if (!correction) continue;
            const [ axis, axisPos, axisVelocity ] = correction;
            if (axis === 1) this.movable.enableJump();
            this.movable.snapCustom(axis, axisPos, axisVelocity);
        }
    }

    /** Handle inputs.
     *  @see GameObject.handleInputs
     *  @param {InputTracker} inputs */
    handleInputs(inputs) {
        if (inputs.has('d')) this.movable.incrementVelocity(new Vector2(1, 0));
        else if (inputs.has('a')) this.movable.incrementVelocity(new Vector2(-1, 0));
        if (inputs.has('w')) this.movable.jump();
    }

    /** Update components.
     *  @see GameObject.update
     *  @param {number} dt */
    update(dt) {
        this.dtRunner.deltaTimeUpdate(dt, this.sprite.nextFrameInRow);
        this.movable.update();
        this.handleTileCollisions();
    }

    /** Draw the object.
     *  @see GameObject.draw
     *  @param {CanvasRenderingContext2D} context */
    draw(context) { this.sprite.draw(context, this.movable.pos); }
}

export default Player;
