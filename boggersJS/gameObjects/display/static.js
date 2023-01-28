import GameObject from '../gameObject.js';
import Vector2 from '../../common/vector2.js';
import Movable from '../../components/movable/movable.js';
import Sprite from '../../components/sprite.js';

/** A static image. 
 *  @augments GameObject */
class Static extends GameObject {
    /** Create the static image.
     *  @param {Vector2} maxDimensions - The bounding dimensions for the static image.
     *  @param {Sprite} sprite - The image itself.
     *  @param {Vector2} pos - The position of the image. */
    constructor(maxDimensions, sprite, pos) {
        super(new Vector2(0, 0), sprite);
        this.movable = new Movable(maxDimensions, this.sprite.dimensions, pos, new Vector2(0, 0), new Vector2(0, 0), new Vector2(0, 0), new Vector2(0, 0));
    }

    /** Draw the object.
     *  @see GameObject.draw
     *  @param {CanvasRenderingContext2D} context */
    draw(context) { this.sprite.draw(context, this.movable.pos); }
}

export default Static;
