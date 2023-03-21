import GameObject from '../game-object.js';
import { Vector2 } from '../../common/index.js';
import { Sprite } from '../../components/index.js';

/** A static image. 
 *  @augments GameObject 
 *  @memberof GameObjects.Display */
class Static extends GameObject {
    /** @type {Vector2} */
    #pos

    /** Create the static image.
     *  @param {Sprite} sprite - The image itself.
     *  @param {Vector2} pos - The position of the image. */
    constructor(sprite, pos) {
        super();
        this.sprite = sprite;
        this.#pos = pos;
    }

    /** Draw the object.
     *  @see GameObject.draw
     *  @param {CanvasRenderingContext2D} context
     *  @param {number} alpha */
    draw(context, alpha) { this.sprite.draw(context, this.#pos); }
}

export default Static;
