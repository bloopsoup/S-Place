import Gun from './gun.js';
import GameObject from '../gameObject.js';
import { Grid, InputTracker, Vector2 } from '../../common/index.js';
import { Sprite, MovablePhysics, Collider, CollisionMap, Health } from '../../components/index.js';

/** A combination of a player and a gun.
 *  @augments GameObject
 *  @memberof GameObjects.Entities */
class Shooter extends GameObject {
    /** @type {Gun} */
    #gun

    /** Create the Shooter.
     *  @param {Sprite} sprite - The player's sprite.
     *  @param {Grid} grid - The grid the player operates in.
     *  @param {Vector2} pos - The player's starting position.
     *  @param {Vector2} maxSpeed - The player's max speed.
     *  @param {Vector2} acceleration - The acceleration of the player.
     *  @param {Vector2} deceleration - The deceleration of the player. 
     *  @param {number} jumpPower - How high the player can jump.
     *  @param {number} health - The starting health.
     *  @param {Gun} gun - The gun. */
    constructor(sprite, grid, pos, maxSpeed, acceleration, deceleration, jumpPower, health, gun) {
        super(sprite);
        this.movable = new MovablePhysics(grid.dimensions, this.sprite.dimensions, pos, new Vector2(0, 0), maxSpeed, acceleration, deceleration, jumpPower);
        this.collider = new Collider(100);
        this.collisionMap = new CollisionMap(grid);
        this.health = new Health(health);
        this.#gun = gun;
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
        this.#gun.handleInputs(inputs);
    }

    /** Update components.
     *  @see GameObject.update */
    update() {
        this.sprite.updateFrame();
        this.movable.update();
        this.collider.update();
        this.handleTileCollisions();

        this.#gun.movable.pos.copyTo(this.#gun.movable.oldPos);
        this.movable.pos.copyTo(this.#gun.movable.pos);
        this.#gun.update();
    }

    /** Draw the object.
     *  @see GameObject.draw
     *  @param {CanvasRenderingContext2D} context
     *  @param {number} alpha */
    draw(context, alpha) { 
        this.sprite.draw(context, this.movable.interpolatePos(alpha));
        this.#gun.draw(context, alpha);
    }
}

export default Shooter;
