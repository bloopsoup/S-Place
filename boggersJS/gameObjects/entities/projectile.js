import GameObject from '../gameObject.js';
import { Grid, Vector2 } from '../../common/index.js';
import { Sprite, Movable, Collider, CollisionMap } from '../../components/index.js';

/** A moving effect which starts at a position and moves according to velocity. 
 *  Marks itself for deletion when out of bounds or colliding with another GameObject.
 *  @augments GameObject 
 *  @memberof GameObjects.Entities */
class Projectile extends GameObject {
    /** @type {number} */
    #damage

    /** Create the projectile.
     *  @param {Sprite} sprite - The sprite of the projectile.
     *  @param {Grid} grid - The grid the projectile resides in.
     *  @param {Vector2} pos - The starting position of the projectile.
     *  @param {Vector2} velocity - The velocity of the projectile.
     *  @param {number} damage - The amount of damage that the projectile will deal. */
    constructor(sprite, grid, pos, velocity, damage) {
        super(sprite);
        this.movable = new Movable(grid.dimensions, this.sprite.dimensions, pos, velocity, new Vector2(0, 0), new Vector2(0, 0), new Vector2(0, 0));
        this.collider = new Collider(50);
        this.collisionMap = new CollisionMap(grid);
        this.#damage = damage;
    }

    /** Handle tile collisions.
     *  @see GameObject.handleTileCollisions */
    handleTileCollisions() {
        const corners = this.movable.corners;
        for (let i in corners) {
            const correction = this.collisionMap.callCollisionHandler(this.movable, corners[i]);
            if (correction) this.markForDeletion();
        }
    }

    /** Update components.
     *  @see GameObject.update */
    update() {
        this.sprite.updateFrame();
        this.movable.incrementPos();
        if (this.movable.outOfBoundsComplete()) this.markForDeletion();
        this.handleTileCollisions();
    }

    /** Draw the object.
     *  @see GameObject.draw
     *  @param {CanvasRenderingContext2D} context */
    draw(context) { this.sprite.draw(context, this.movable.pos); }
}

export default Projectile;
