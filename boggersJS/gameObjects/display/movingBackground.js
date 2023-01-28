import GameObject from '../gameObject.js';
import MovableBG from '../../components/movable/movableBG.js';
import Vector2 from '../../common/vector2.js';
import Sprite from '../../components/sprite.js';

/** An infinitely scrolling background. Velocity is used to indicate a cardinal
 *  direction of the moving background.
 *  @augments GameObject */
class MovingBackground extends GameObject {
    /** Create the MovingBackground.
     *  @param {Vector2} maxDimensions - Limits how far the background can move.
     *  @param {Sprite} sprite -  The background image itself.
     *  @param {Vector2} velocity - The direction and speed of the background. */
    constructor(maxDimensions, sprite, velocity) {
        super(maxDimensions, sprite);
        this.movable = new MovableBG(maxDimensions, this.sprite.dimensions, velocity);
    }

    /** Update components.
     *  @see GameObject.update
     *  @param {number} dt */
    update(dt) {
        this.movable.update();
    }

    /** Draw the object.
     *  @see GameObject.draw
     *  @param {CanvasRenderingContext2D} context */
    draw(context) {
        this.sprite.draw(context, this.movable.pos);
        this.sprite.draw(context, this.movable.nextPos);
    }
}

export default MovingBackground;
