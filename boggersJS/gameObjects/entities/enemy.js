import GameObject from '../gameObject.js';
import Health from '../../components/health.js';
import Vector2 from '../../common/vector2.js';
import Movable from '../../components/movable/movable.js';
import Collider from '../../components/collider.js';
import Sprite from '../../components/sprite.js';

/** A standard enemy class with translation-based movement behavior. Features
 *  a health component which is used to determine whether this object should
 *  delete itself (aka die). 
 * 
 *  Because its movement is translation-based, it cannot support tile collisions.
 *  @augments GameObject */
class Enemy extends GameObject {
    /** Create the Enemy.
     *  @param {Vector2} maxDimensions - The bounding dimensions of the enemy.
     *  @param {Sprite} sprite - The sprite for the enemy.
     *  @param {Vector2} pos - The starting position.
     *  @param {Vector2} velocity - The starting velocity. 
     *  @param {number} health - The health of the enemy. 
     *  @param {number} defense - The defense of the enemy. */
    constructor(maxDimensions, sprite, pos, velocity, health, defense) {
        super(maxDimensions, sprite);
        this.movable = new Movable(maxDimensions, this.sprite.dimensions, pos, velocity, new Vector2(0, 0), new Vector2(0, 0), new Vector2(0, 0));
        this.collider = new Collider(100);
        this.health = new Health(health, 1, defense, 0);
    }

    /** Handle collisions.
     *  @see GameObject.handleCollisions
     *  @param {GameObject} other */
    handleCollisions(other) {
        if (this.collider.collides(this.movable, other.movable, true)) console.log('ENEMY GOES OUCH');
    }

    /** Update components.
     *  @see GameObject.update
     *  @param {number} dt */
    update(dt) {
        this.dtRunner.deltaTimeUpdate(dt, this.sprite.nextFrameInRow);
        this.movable.incrementPos();
        if (this.movable.pastLeftWallComplete()) this.movable.velocity = new Vector2(8, 0);
        if (this.movable.pastRightWallComplete()) this.movable.velocity = new Vector2(-8, 0);
    }

    /** Draw the object.
     *  @see GameObject.draw
     *  @param {CanvasRenderingContext2D} context */
    draw(context) { this.sprite.draw(context, this.movable.pos); }
}

export default Enemy;
