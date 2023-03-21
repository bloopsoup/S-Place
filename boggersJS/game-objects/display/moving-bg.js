import GameObject from '../game-object.js';
import { InputTracker, Vector2 } from '../../common/index.js';
import { MovableBG, Sprite } from '../../components/index.js';

/** An infinitely scrolling background. Velocity is used to indicate a cardinal
 *  direction of the moving background.
 *  @augments GameObject 
 *  @memberof GameObjects.Display */
class MovingBackground extends GameObject {
    /** Create the MovingBackground.
     *  @param {Vector2} maxDimensions - Limits how far the background can move.
     *  @param {Sprite} sprite -  The background image itself.
     *  @param {Vector2} velocity - The direction and speed of the background. */
    constructor(maxDimensions, sprite, velocity) {
        super();
        this.sprite = sprite;
        this.movable = new MovableBG(maxDimensions, this.sprite.dimensions, velocity);
    }

    /** Handle inputs and update components.
     *  @see GameObject.update
     *  @param {InputTracker} inputs */
    update(inputs) { 
        this.movable.incrementPos();
        if (this.movable.outOfBoundsComplete()) this.movable.resetPos(); 
    }

    /** Draw the object.
     *  @see GameObject.draw
     *  @param {CanvasRenderingContext2D} context
     *  @param {number} alpha */
    draw(context, alpha) {
        this.sprite.draw(context, this.movable.pos);
        this.sprite.draw(context, this.movable.nextPos);
    }
}

export default MovingBackground;
