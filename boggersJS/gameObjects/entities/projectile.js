import GameObject from '../gameObject.js';
import { Vector2 } from '../../common/index.js';
import { Sprite, Movable, Collider } from '../../components/index.js';

/** A moving effect which starts at a position and moves according to velocity. 
 *  Marks itself for deletion when out of bounds or colliding with another GameObject.
 *  @augments GameObject 
 *  @memberof GameObjects.Entities */
class Projectile extends GameObject {
    /** @type {number} */
    #damage

    /** Create the projectile.
     *  @param {Vector2} maxDimensions - How far the projectile can go without being marked for deletion.
     *  @param {Sprite} sprite - The sprite of the projectile.
     *  @param {Vector2} pos - The starting position of the projectile.
     *  @param {Vector2} velocity - The velocity of the projectile.
     *  @param {number} damage - The amount of damage that the projectile will deal. */
    constructor(maxDimensions, sprite, pos, velocity, damage) {
        super(maxDimensions, sprite);
        this.movable = new Movable(maxDimensions, this.sprite.dimensions, pos, velocity, new Vector2(0, 0), new Vector2(0, 0), new Vector2(0, 0));
        this.collider = new Collider(50);
        this.#damage = damage;
    }

    /** Update components.
     *  @see GameObject.update
     *  @param {number} dt */
    update(dt) {
        this.dtRunner.deltaTimeUpdate(dt, this.sprite.nextFrameInRow);
        this.movable.incrementPos();
        if (this.movable.outOfBoundsComplete()) this.markForDeletion();
    }

    /** Draw the object.
     *  @see GameObject.draw
     *  @param {CanvasRenderingContext2D} context */
    draw(context) { this.sprite.draw(context, this.movable.pos); }
}

export default Projectile;
