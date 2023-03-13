import GameObject from '../gameObject.js';
import { Grid, Vector2 } from '../../common/index.js';
import { Movable, Sprite } from '../../components/index.js';

/** A continuous background.
 *  @augments GameObject 
 *  @memberof GameObjects.Display */
class ContinuousBackground extends GameObject {
    /** Create the ContinuousBackground.
     *  @param {Sprite} sprite - The background to splice together.
     *  @param {Grid} grid - Provides the maximum dimensions for the background. 
     *  @param {Vector2} pos - The starting position of the background. */
    constructor(sprite, grid, pos) {
        super();
        this.sprite = sprite;
        this.movable = new Movable(grid.dimensions, this.sprite.dimensions, pos, new Vector2(0, 0), new Vector2(0, 0), new Vector2(0, 0), new Vector2(0, 0));
    }

    /** Draw the object.
     *  @see GameObject.draw
     *  @param {CanvasRenderingContext2D} context
     *  @param {number} alpha */
    draw(context, alpha) {
        const n = Math.ceil((this.movable.maxDimensions.x - this.movable.pos.x) / this.movable.dimensions.x);
        const pos = this.movable.pos.copy();
        for (let i = 0; i < n; i++) {
            this.sprite.draw(context, pos);
            pos.x += this.movable.dimensions.x;
        }
    }
}

export default ContinuousBackground;
