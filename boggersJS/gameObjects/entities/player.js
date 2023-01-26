import GameObject from '../gameObject.js';
import Vector2 from '../../common/vector2.js';
import MovablePhysics from '../../components/movable/movablePhysics.js';
import Collider from '../../components/collider.js';
import Health from '../../components/health.js';
import Sprite from '../../components/sprite.js';
import Input from '../../common/input.js';

/** The player character directly controlled via user input. Has physics-based
 *  movement behavior which supports tile-based collision. Also has a health
 *  component similar to Enemy.
 *  @augments GameObject */
class Player extends GameObject {
    /** Create the Player.
     *  @param {Vector2} maxDimensions - The bounding dimensions for the player.
     *  @param {Sprite} sprite - The player's sprite.
     *  @param {Vector2} pos - The player's starting position.
     *  @param {Vector2} maxSpeed - The player's max speed.
     *  @param {Vector2} acceleration - The acceleration of the player.
     *  @param {Vector2} deceleration - The deceleration of the player. 
     *  @param {number} jumpPower - How high the player can jump.
     *  @param {number} health - The starting health. */
    constructor(maxDimensions, sprite, pos, maxSpeed, acceleration, deceleration, jumpPower, health) {
        super(maxDimensions, sprite);
        this.movable = new MovablePhysics(maxDimensions, this.sprite.dimensions, pos, new Vector2(0, 0), maxSpeed, acceleration, deceleration, jumpPower);
        this.collider = new Collider(100);
        this.health = new Health(health);
    }

    /** Handle collisions.
     *  @see GameObject.handleCollisions
     *  @param {GameObject} other 
     *  @param {boolean} buffered */
    handleCollisions(other, buffered) {
        if (this.collider.collides(this.movable, other.movable, buffered)) console.log('PLAYER GOES OUCH');
    }

    /** Handle inputs.
     *  @see GameObject.handleInputs
     *  @param {Object.<string, Input>} inputs */
    handleInputs(inputs) {
        if ('ArrowRight' in inputs) this.movable.incrementVelocity(new Vector2(1, 0));
        else if ('ArrowLeft' in inputs) this.movable.incrementVelocity(new Vector2(-1, 0));
        if ('ArrowUp' in inputs) this.movable.jump();
    }

    /** Update components.
     *  @see GameObject.update
     *  @param {number} dt */
    update(dt) {
        this.dtRunner.deltaTimeUpdate(dt, this.sprite.nextFrameInRow);
        this.movable.update();
    }

    /** Draw the object.
     *  @see GameObject.draw
     *  @param {CanvasRenderingContext2D} context */
    draw(context) { this.sprite.draw(context, this.movable.pos); }
}

export default Player;
